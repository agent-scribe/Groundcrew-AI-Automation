import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroDemo } from "@/components/marketing/hero-demo";
import { Calculator } from "@/components/marketing/calculator";
import { Pricing, Faq } from "@/components/marketing/pricing";
import {
  LogoStrip,
  HowItWorks,
  PortalSection,
  ChaseSection,
  IntegrationsGrid,
} from "@/components/marketing/sections";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <section className="grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
          <div>
            <Badge variant="cleared" className="mb-6">
              Now boarding — early access
            </Badge>
            <h1 className="font-display max-w-xl text-5xl font-semibold tracking-tight md:text-6xl">
              Signed to kickoff, on autopilot.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-text-2 md:text-xl">
              Groundcrew reads your proposal, builds the project plan in
              ClickUp or Asana, spins up a branded client portal, and chases
              every missing asset — turning 20 hours of onboarding into 9
              minutes.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="rounded-full px-7">
                  Watch a real SOW become a project
                  <ArrowRight aria-hidden />
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-text-2">
              The AI crew behind every clean kickoff. No credit card to watch
              the demo.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HeroDemo />
          </div>
        </section>
      </div>

      <LogoStrip />

      {/* Time math */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <section className="py-24 text-center">
          <h2 className="font-display mx-auto max-w-2xl text-4xl font-semibold">
            Onboarding a client takes your team 15–20 hours. Groundcrew does
            it in 9 minutes.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-2">
            Slide to see what the 25–40 step onboarding grind costs you every
            year.
          </p>
          <div className="mt-12">
            <Calculator />
          </div>
        </section>

        <HowItWorks />
        <PortalSection />
        <ChaseSection />
        <IntegrationsGrid />
        <Pricing />
        <Faq />
      </div>

      {/* CTA band */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-12">
          <h2 className="font-display text-4xl font-semibold">
            Put a crew on your next kickoff.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-text-2">
            Run the sample SOW right now — watch 23 items extract, verify, and
            push in under a minute.
          </p>
          <Link href="/dashboard" className="mt-8 inline-block">
            <Button size="lg" className="rounded-full px-8">
              Watch a SOW take off
              <ArrowRight aria-hidden />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
