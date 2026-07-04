import { applyRateLimit, getIdentifier } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * POST /api/extract — Two-pass OpenAI extraction.
 * Pass 1: extract deliverables, milestones, budget from the SOW text.
 * Pass 2: verify citations against source pages.
 */
export async function POST(request: Request) {
  // Rate limiting
  const rateLimitResponse = await applyRateLimit(getIdentifier(request));
  if (rateLimitResponse) return rateLimitResponse;

  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await request.json();
  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  // Load project
  const { data: projectRaw } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  const project = projectRaw as Record<string, unknown> | null;

  if (!project || !project.sow_storage_path) {
    return NextResponse.json({ error: "Project or SOW not found" }, { status: 404 });
  }

  const sowPath = project.sow_storage_path as string;

  // Download SOW from storage
  const { data: fileData, error: dlErr } = await supabase.storage
    .from("sow-uploads")
    .download(sowPath);

  if (dlErr || !fileData) {
    return NextResponse.json({ error: "Failed to download SOW" }, { status: 500 });
  }

  const buffer = Buffer.from(await fileData.arrayBuffer());
  const isDocx = sowPath.endsWith(".docx");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  // ── Pass 1: Extract structured data ──
  const pass1System = `You are a contract extraction engine for Groundcrew.
Given a Statement of Work (SOW), extract ALL of the following as JSON:
- deliverables: [{ title, description, estimateH, dueOffsetDays, owner }]
- milestones: [{ title, due }]
- budget: [{ label, amount }]
- clientName, projectName, totalValue, duration
Be exhaustive. Return ONLY valid JSON, no markdown.`;

  let pass1Content: Array<{ type: string; [key: string]: unknown }>;

  if (!isDocx) {
    const b64 = buffer.toString("base64");
    pass1Content = [
      { type: "text", text: "Extract all deliverables, milestones, and budget from this SOW document." },
      { type: "image_url", image_url: { url: `data:application/pdf;base64,${b64}` } },
    ];
  } else {
    const textContent = buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
    pass1Content = [
      { type: "text", text: `Extract all deliverables, milestones, and budget from this SOW:\n\n${textContent}` },
    ];
  }

  const pass1Res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: pass1System },
        { role: "user", content: pass1Content },
      ],
      max_tokens: 4096,
      temperature: 0,
    }),
  });

  if (!pass1Res.ok) {
    const errText = await pass1Res.text();
    return NextResponse.json({ error: `OpenAI Pass 1 failed: ${errText}` }, { status: 502 });
  }

  const pass1Json = await pass1Res.json();
  const pass1Text: string = pass1Json.choices?.[0]?.message?.content ?? "{}";

  interface ExtractedData {
    deliverables?: Array<{ title: string; description?: string; estimateH?: number; dueOffsetDays?: number; owner?: string }>;
    milestones?: Array<{ title: string; due?: string }>;
    budget?: Array<{ label: string; amount?: string }>;
    clientName?: string;
    projectName?: string;
  }

  let extracted: ExtractedData;
  try {
    const cleaned = pass1Text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    extracted = JSON.parse(cleaned);
  } catch {
    extracted = { deliverables: [], milestones: [], budget: [] };
  }

  // ── Pass 2: Citation grounding ──
  const pass2System = `You are a citation verification engine. Given extracted items and the source document,
for each item assign a confidence level:
- "verified": exact quote found in source
- "inferred": meaning present but not a direct quote
- "low": cannot be confirmed
Return JSON array: [{ itemIndex, confidence, quote, page }]. ONLY valid JSON.`;

  const itemSummary = [
    ...(extracted.deliverables || []).map((d, i) => `[${i}] Deliverable: ${d.title}`),
    ...(extracted.milestones || []).map((m, i) => `[${(extracted.deliverables?.length ?? 0) + i}] Milestone: ${m.title}`),
    ...(extracted.budget || []).map((b, i) => `[${(extracted.deliverables?.length ?? 0) + (extracted.milestones?.length ?? 0) + i}] Budget: ${b.label} — ${b.amount}`),
  ].join("\n");

  const pass2Res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: pass2System },
        { role: "user", content: pass1Content.concat([{ type: "text", text: `\n\nItems to verify:\n${itemSummary}` }]) },
      ],
      max_tokens: 4096,
      temperature: 0,
    }),
  });

  let citations: Array<{ itemIndex: number; confidence: string; quote: string; page: number }> = [];
  if (pass2Res.ok) {
    const pass2Json = await pass2Res.json();
    const pass2Text: string = pass2Json.choices?.[0]?.message?.content ?? "[]";
    try {
      const cleaned = pass2Text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      citations = JSON.parse(cleaned);
    } catch { /* keep empty */ }
  }

  // ── Store in Supabase ──
  const allItems = [
    ...(extracted.deliverables || []).map((d) => ({ title: d.title, category: "deliverable" })),
    ...(extracted.milestones || []).map((m) => ({ title: m.title, category: "milestone" })),
    ...(extracted.budget || []).map((b) => ({ title: `${b.label}: ${b.amount ?? ""}`, category: "budget" })),
  ];

  const verifiedCount = citations.filter((c) => c.confidence === "verified").length;

  const { data: extraction, error: extErr } = await supabase
    .from("extractions")
    .insert({
      project_id: projectId,
      pass: 2 as const,
      raw_json: { extracted, citations } as unknown as Record<string, unknown>,
      item_count: allItems.length,
      verified_count: verifiedCount,
    })
    .select("id")
    .single();

  const ext = extraction as Record<string, unknown> | null;

  if (extErr || !ext) {
    return NextResponse.json({ error: "Failed to store extraction" }, { status: 500 });
  }

  const extId = ext.id as string;

  const itemRows = allItems.map((item, idx) => {
    const cite = citations.find((c) => c.itemIndex === idx);
    return {
      extraction_id: extId,
      project_id: projectId,
      title: item.title,
      category: item.category,
      cite_id: cite ? `c_${idx}` : null,
      page: cite?.page ?? null,
      status: (cite?.confidence === "low" ? "needs_review" : "verified") as "verified" | "needs_review",
    };
  });

  if (itemRows.length > 0) {
    await supabase.from("extraction_items").insert(itemRows);
  }

  await supabase
    .from("projects")
    .update({ status: "review" })
    .eq("id", projectId);

  return NextResponse.json({
    extractionId: extId,
    itemCount: allItems.length,
    verifiedCount,
    extracted,
    citations,
  });
}
