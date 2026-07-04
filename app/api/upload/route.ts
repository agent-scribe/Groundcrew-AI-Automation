import { applyRateLimit, getIdentifier } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * POST /api/upload — upload SOW file to Supabase Storage,
 * create a project record, return project ID.
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

  const { data: membershipRaw } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  const membership = membershipRaw as Record<string, unknown> | null;
  if (!membership) {
    return NextResponse.json({ error: "No org found" }, { status: 400 });
  }

  const orgId = membership.org_id as string;
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const clientName = (formData.get("clientName") as string) || "";
  const clientEmail = (formData.get("clientEmail") as string) || "";
  const projectName = (formData.get("projectName") as string) || clientName || "Untitled";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
  const storagePath = `${orgId}/${Date.now()}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from("sow-uploads")
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: projectRaw, error: projErr } = await supabase
    .from("projects")
    .insert({
      org_id: orgId,
      name: projectName,
      client_name: clientName,
      client_email: clientEmail,
      status: "runway" as const,
      sow_storage_path: storagePath,
    })
    .select("id, portal_token")
    .single();

  const project = projectRaw as Record<string, unknown> | null;

  if (projErr || !project) {
    return NextResponse.json({ error: projErr?.message ?? "Insert failed" }, { status: 500 });
  }

  const projectId = project.id as string;

  const steps = [
    { step: "questionnaire", label: "Complete onboarding questionnaire" },
    { step: "upload", label: "Upload brand assets" },
    { step: "access", label: "Grant tool access" },
    { step: "schedule", label: "Schedule kickoff call" },
  ];

  await supabase.from("portal_checklist").insert(
    steps.map((s) => ({ project_id: projectId, ...s, done: false })),
  );

  return NextResponse.json({
    projectId,
    portalToken: project.portal_token,
    storagePath,
  });
}
