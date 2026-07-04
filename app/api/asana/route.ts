import { NextResponse } from "next/server";

/**
 * GET /api/asana — redirect to Asana OAuth consent screen.
 * State param includes CSRF-safe redirect path (only relative paths allowed).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") || "/settings";

  // Validate redirect is a relative path (prevent open redirect)
  const safePath = next.startsWith("/") && !next.startsWith("//") ? next : "/settings";

  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/asana/callback`;

  const params = new URLSearchParams({
    client_id: process.env.ASANA_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    state: safePath,
  });

  return NextResponse.redirect(
    `https://app.asana.com/-/oauth_authorize?${params.toString()}`,
  );
}
