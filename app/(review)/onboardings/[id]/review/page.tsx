export const metadata = { title: "Review" };

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Next 16: await params
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-text-2">
        ManifestSplitView for onboarding <span className="font-mono">{id}</span>{" "}
        lands in Phase 5.
      </p>
    </div>
  );
}
