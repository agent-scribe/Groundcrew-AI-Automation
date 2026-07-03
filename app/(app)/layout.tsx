import { AppSidebar } from "@/components/app-sidebar";

/**
 * App shell (Plan 10 §5): sidebar 256px, content max-w 1440.
 * Demo mode: no auth gate yet — Supabase wiring is a later phase.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <AppSidebar />
      <div className="lg:pl-64">
        <div className="mx-auto max-w-[1440px]">{children}</div>
      </div>
    </div>
  );
}
