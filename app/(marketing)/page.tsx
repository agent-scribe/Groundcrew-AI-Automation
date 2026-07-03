import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12">
      <section className="flex flex-col items-center py-24 text-center md:py-32">
        <Badge variant="cleared" className="mb-6">
          Now boarding — early access
        </Badge>
        <h1 className="font-display max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">
          Signed to kickoff, on autopilot.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-text-2 md:text-xl">
          Groundcrew reads your proposal, builds the project plan in ClickUp or
          Asana, spins up a branded client portal, and chases every missing
          asset — turning 20 hours of onboarding into 9 minutes.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/dashboard">
            <Button size="lg" className="rounded-full px-7">
              Watch a real SOW become a project
              <ArrowRight aria-hidden />
            </Button>
          </Link>
          <Link href="/#pricing">
            <Button size="lg" variant="ghost" className="rounded-full px-7">
              See pricing
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-sm text-text-2">
          The AI crew behind every clean kickoff.
        </p>
      </section>
    </div>
  );
}
