import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Copy, Send } from "lucide-react";
import { AppTopbar } from "@/components/app-topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailTabs } from "@/components/onboarding/detail-tabs";
import { getOnboarding, STAGES } from "@/lib/demo-data";

export const metadata = { title: "Onboarding" };

export default async function OnboardingDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pushed?: string }>;
}) {
  const { id } = await params; // Next 16: await params
  const { pushed } = await searchParams; // Next 16: await searchParams
  const o = getOnboarding(id) ?? getOnboarding("acme-seo");
  if (!o) notFound();

  return (
    <>
      <AppTopbar title={o.client} />
      <main id="main" className="p-6">
        {pushed === "1" && (
          <div className="gc-sweep mb-6 flex items-center gap-2.5 rounded-[var(--radius-item)] bg-cleared px-4 py-3 text-sm font-semibold text-white">
            <Check size={16} strokeWidth={3} aria-hidden />
            Cleared for takeoff — 6 deliverables pushed to ClickUp. Portal is
            ready to send.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={o.stage === "wheels_up" ? "cleared" : "navy"}>
            {STAGES.find((s) => s.key === o.stage)?.label}
          </Badge>
          <span className="text-sm text-text-2">
            Kickoff:{" "}
            <span className="font-mono font-medium text-text" data-mono>
              {o.kickoff ?? "not set"}
            </span>
          </span>
          <span className="text-sm text-text-2">
            Contact: <span className="font-medium text-text">{o.contact}</span>
          </span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline">
              <Copy size={14} aria-hidden /> Copy portal link
            </Button>
            <Link href={`/p/demo-${o.id}`}>
              <Button size="sm">
                <Send size={14} aria-hidden /> View client portal
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <DetailTabs onboarding={o} />
        </div>
      </main>
    </>
  );
}
