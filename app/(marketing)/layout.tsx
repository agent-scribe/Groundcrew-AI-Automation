import Link from "next/link";
import { Logo, Mark } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link href="/" aria-label="Groundcrew home">
            <Logo size={22} />
          </Link>
          <div className="hidden items-center gap-8 text-sm text-text-2 md:flex">
            <Link href="/#product" className="hover:text-text">Product</Link>
            <Link href="/#integrations" className="hover:text-text">Integrations</Link>
            <Link href="/#pricing" className="hover:text-text">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden text-sm text-text-2 hover:text-text sm:block">
              Sign in
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="rounded-full px-4">
                Watch a SOW take off
              </Button>
            </Link>
          </div>
        </nav>
      </header>
      <main id="main">{children}</main>
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
            <div>
              <Logo size={20} />
              <p className="mt-2 max-w-sm text-sm text-text-2">
                The AI crew behind every clean kickoff. Signed SOW in, live
                project out.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div className="flex flex-col gap-2">
                <span className="font-medium text-text">Product</span>
                <Link href="/#product" className="text-text-2 hover:text-text">How it works</Link>
                <Link href="/#pricing" className="text-text-2 hover:text-text">Pricing</Link>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-medium text-text">Integrations</span>
                <Link href="/#integrations" className="text-text-2 hover:text-text">ClickUp</Link>
                <Link href="/#integrations" className="text-text-2 hover:text-text">Asana</Link>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-medium text-text">Legal</span>
                <Link href="/terms" className="text-text-2 hover:text-text">Terms</Link>
                <Link href="/privacy" className="text-text-2 hover:text-text">Privacy</Link>
                <Link href="/cookies" className="text-text-2 hover:text-text">Cookies</Link>
              </div>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6 text-xs text-text-2">
            <span>© 2026 Groundcrew. All rights reserved.</span>
            <span className="inline-flex items-center gap-1.5">
              <Mark size={14} className="text-cleared" /> Cleared for takeoff
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
