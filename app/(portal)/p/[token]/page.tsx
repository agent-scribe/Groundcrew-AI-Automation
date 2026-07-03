import { PortalShell } from "@/components/portal/portal-shell";

export const metadata = { title: "Client Portal" };

// Dynamic by nature — never cached (Plan 11 §0: portals are per-token).
export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params; // Next 16: await params
  return <PortalShell token={token} />;
}
