/**
 * Portal chrome (Plan 10 §5): single centered column, oversized type,
 * feels like a beautifully set letter. No app auth here — portal-token only.
 * Light-only by design (client trust). Never cached (Plan 11 §0).
 */
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg text-[18px]">
      <main id="main" className="mx-auto w-full max-w-2xl px-5 py-8 sm:py-12">
        {children}
      </main>
    </div>
  );
}
