/**
 * Asana API helpers — OAuth + task creation.
 * Uses PAT for server-side calls when no user OAuth token is available.
 */

const ASANA_BASE = "https://app.asana.com/api/1.0";

export interface AsanaToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

/** Exchange OAuth code for token */
export async function exchangeAsanaCode(code: string, redirectUri: string): Promise<AsanaToken> {
  const res = await fetch("https://app.asana.com/-/oauth_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.ASANA_CLIENT_ID!,
      client_secret: process.env.ASANA_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      code,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Asana token exchange failed: ${text}`);
  }

  return res.json();
}

/** Refresh an expired token */
export async function refreshAsanaToken(refreshToken: string): Promise<AsanaToken> {
  const res = await fetch("https://app.asana.com/-/oauth_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.ASANA_CLIENT_ID!,
      client_secret: process.env.ASANA_CLIENT_SECRET!,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) throw new Error("Asana token refresh failed");
  return res.json();
}

/** Get the token to use — PAT fallback if no OAuth token stored */
function getToken(oauthToken?: string): string {
  return oauthToken || process.env.ASANA_PAT!;
}

/** List workspaces */
export async function listWorkspaces(token?: string) {
  const res = await fetch(`${ASANA_BASE}/workspaces`, {
    headers: { Authorization: `Bearer ${getToken(token)}` },
  });
  const data = await res.json();
  return data.data as Array<{ gid: string; name: string }>;
}

/** List projects in a workspace */
export async function listProjects(workspaceGid: string, token?: string) {
  const res = await fetch(
    `${ASANA_BASE}/projects?workspace=${workspaceGid}&opt_fields=name,gid`,
    { headers: { Authorization: `Bearer ${getToken(token)}` } },
  );
  const data = await res.json();
  return data.data as Array<{ gid: string; name: string }>;
}

/** Create a project */
export async function createProject(
  workspaceGid: string,
  name: string,
  token?: string,
) {
  const res = await fetch(`${ASANA_BASE}/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken(token)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: { workspace: workspaceGid, name, default_view: "list" },
    }),
  });
  const data = await res.json();
  return data.data as { gid: string; name: string };
}

/** Create a section in a project */
export async function createSection(projectGid: string, name: string, token?: string) {
  const res = await fetch(`${ASANA_BASE}/projects/${projectGid}/sections`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken(token)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: { name } }),
  });
  const data = await res.json();
  return data.data as { gid: string; name: string };
}

/**
 * Create a task (idempotent by external_id).
 * Asana doesn't have native external_id dedup, so we search first.
 */
export async function createTaskIdempotent(
  projectGid: string,
  sectionGid: string | null,
  task: {
    name: string;
    notes?: string;
    due_on?: string;
    external_id: string;
  },
  token?: string,
) {
  const authToken = getToken(token);

  // Search for existing task with same name in project (idempotency check)
  const searchRes = await fetch(
    `${ASANA_BASE}/tasks?project=${projectGid}&opt_fields=name,external&completed_since=now`,
    { headers: { Authorization: `Bearer ${authToken}` } },
  );
  const existing = await searchRes.json();
  const found = (existing.data || []).find(
    (t: { name: string }) => t.name === task.name,
  );

  if (found) {
    return { gid: found.gid, name: found.name, created: false };
  }

  // Create the task
  const body: Record<string, unknown> = {
    name: task.name,
    notes: task.notes || "",
    projects: [projectGid],
    external: { gid: task.external_id, data: task.external_id },
  };

  if (task.due_on) body.due_on = task.due_on;

  const res = await fetch(`${ASANA_BASE}/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: body }),
  });

  const data = await res.json();
  const created = data.data as { gid: string; name: string };

  // Move to section if specified
  if (sectionGid && created?.gid) {
    await fetch(`${ASANA_BASE}/sections/${sectionGid}/addTask`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { task: created.gid } }),
    });
  }

  return { ...created, created: true };
}
