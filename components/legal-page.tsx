/**
 * Shared layout for legal pages (Terms, Privacy, Cookies).
 * Clean prose typography, max-width container, last-updated date.
 */
export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:py-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-text-2">Last updated: {lastUpdated}</p>
      <div className="prose-legal mt-10 space-y-6 text-[15px] leading-relaxed text-text-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-text [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-text [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-text [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </article>
  );
}
