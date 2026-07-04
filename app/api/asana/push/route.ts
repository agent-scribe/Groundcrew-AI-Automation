import { applyRateLimit, getIdentifier } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  listWorkspaces,
  createProject,
  createSection,
  createTaskIdempotent,
} from "@/lib/asana";

/**
 * POST /api/asana/push — Push extraction items to Asana as tasks.
 * Idempotent: re-running won't create duplicates.
 *
 * Body: { projectId: string, workspaceGid?: string }
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

  const { projectId, workspaceGid: wGid } = await request.json();
  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  // Get Asana token (OAuth or PAT fallback)
  const asanaToken =
    (user.user_metadata?.asana_access_token as string) || undefined;

  // Get project details
  const { data: gcProject } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (!gcProject) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Get extraction items
  const { data: items } = await supabase
    .from("extraction_items")
    .select("*")
    .eq("project_id", projectId)
    .in("status", ["verified"]);

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "No verified items to push" }, { status: 400 });
  }

  // Determine workspace
  let workspaceGid = wGid;
  if (!workspaceGid) {
    const workspaces = await listWorkspaces(asanaToken);
    if (workspaces.length === 0) {
      return NextResponse.json({ error: "No Asana workspaces found" }, { status: 400 });
    }
    workspaceGid = workspaces[0].gid;
  }

  // Create Asana project
  const asanaProject = await createProject(
    workspaceGid,
    `${gcProject.name || gcProject.client_name} — Groundcrew`,
    asanaToken,
  );

  // Create sections by category
  const categories = [...new Set(items.map((i: Record<string, unknown>) => i.category as string))];
  const sectionMap: Record<string, string> = {};

  for (const cat of categories) {
    const section = await createSection(
      asanaProject.gid,
      cat.charAt(0).toUpperCase() + cat.slice(1) + "s",
      asanaToken,
    );
    sectionMap[cat] = section.gid;
  }

  // Push tasks idempotently
  const results = [];
  for (const item of items) {
    const i = item as Record<string, unknown>;
    const result = await createTaskIdempotent(
      asanaProject.gid,
      sectionMap[i.category as string] || null,
      {
        name: i.title as string,
        notes: `Category: ${i.category}\nExtracted by Groundcrew\nCitation: ${i.cite_id || "none"}`,
        external_id: `gc_${i.id}`,
      },
      asanaToken,
    );
    results.push(result);

    // Store Asana task GID back in extraction_items
    if (result.gid) {
      await supabase
        .from("extraction_items")
        .update({ pushed_task_id: result.gid })
        .eq("id", i.id);
    }
  }

  // Update project status
  await supabase
    .from("projects")
    .update({ status: "pushed" })
    .eq("id", projectId);

  return NextResponse.json({
    asanaProjectGid: asanaProject.gid,
    asanaProjectUrl: `https://app.asana.com/0/${asanaProject.gid}`,
    tasksCreated: results.filter((r) => r.created).length,
    tasksSkipped: results.filter((r) => !r.created).length,
    total: results.length,
  });
}
