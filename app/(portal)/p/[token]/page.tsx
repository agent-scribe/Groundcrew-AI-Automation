export const metadata = { title: "Client Portal" };

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params; // Next 16: await params
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-text-2" data-mono>
        Portal <span className="font-mono">{token}</span> — pre-flight
        checklist lands in Phase 6.
      </p>
    </div>
  );
}
