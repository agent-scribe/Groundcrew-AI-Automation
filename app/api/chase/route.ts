import { applyRateLimit, getIdentifier } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { sendChaseEmail } from "@/lib/email/resend";

/**
 * POST /api/chase — Send a chase/reminder email for a project.
 * Body: { projectId: string }
 * Determines pending portal steps, sends email, logs chase_event.
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
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (!project.client_email) {
    return NextResponse.json({ error: "No client email" }, { status: 400 });
  }

  // Get pending checklist items
  const { data: checklist } = await supabase
    .from("portal_checklist")
    .select("*")
    .eq("project_id", projectId)
    .eq("done", false);

  const pendingSteps = (checklist || []).map((c: Record<string, unknown>) => c.label as string);

  if (pendingSteps.length === 0) {
    return NextResponse.json({ error: "All steps complete, no chase needed" }, { status: 400 });
  }

  // Count previous chases
  const { count } = await supabase
    .from("chase_events")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId);

  const chaseNumber = (count || 0) + 1;

  // Build portal URL
  const origin = new URL(request.url).origin;
  const portalUrl = `${origin}/p/${project.portal_token}`;

  // Send the email
  const result = await sendChaseEmail(
    project.client_email,
    project.client_name || "there",
    project.name,
    portalUrl,
    pendingSteps,
    chaseNumber,
  );

  // Log chase event
  await supabase.from("chase_events").insert({
    project_id: projectId,
    channel: "email",
    subject: `Chase #${chaseNumber}: ${pendingSteps.length} items pending`,
  });

  return NextResponse.json({
    sent: true,
    chaseNumber,
    pendingSteps: pendingSteps.length,
    emailId: result.data?.id,
  });
}
