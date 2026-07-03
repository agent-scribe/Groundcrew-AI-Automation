import { ManifestSplitView } from "@/components/review/manifest-split-view";

export const metadata = { title: "Review" };

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Next 16: await params
  return <ManifestSplitView onboardingId={id} />;
}
