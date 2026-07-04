import { NextResponse } from "next/server";

/**
 * GET /api/asana — redirect to Asana OAuth consent screen.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") || "/settings";
  
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/asana/callback`;

  const params = new URLSearchParams({
    client_id: process.env.ASANA_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    state: next,
  });

  return NextResponse.redirect(
    `https://app.asana.com/-/oauth_authorize?${params.toString()}`,
  );
}
