"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "./server";

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getUser() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserOrg() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, role, orgs(id, name, slug, plan)")
    .eq("user_id", user.id)
    .single();

  if (!membership) return null;

  const m = membership as Record<string, unknown>;
  return { user, org: m.orgs, role: m.role as string };
}
