import { NextResponse } from "next/server";
import { exchangeAsanaCode } from "@/lib/asana";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * GET /api/asana/callback — Asana OAuth callback.
 * Exchanges code for token, stores in Supabase user metadata.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "/settings";

  // Validate state is a safe relative path (prevent open redirect)
  const safePath = state.startsWith("/") && !state.startsWith("//") ? state : "/settings";

  if (!code) {
    return NextResponse.redirect(`${origin}/settings?error=asana_no_code`);
  }

  try {
    const redirectUri = `${origin}/api/asana/callback`;
    const token = await exchangeAsanaCode(code, redirectUri);

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.auth.updateUser({
        data: {
          asana_access_token: token.access_token,
          asana_refresh_token: token.refresh_token,
          asana_token_expires: Date.now() + token.expires_in * 1000,
        },
      });
    }

    return NextResponse.redirect(`${origin}${safePath}?asana=connected`);
  } catch (err) {
    console.error("Asana OAuth error:", err);
    return NextResponse.redirect(`${origin}/settings?error=asana_oauth`);
  }
}
