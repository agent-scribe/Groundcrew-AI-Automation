/**
 * Review chrome (Plan 10 §5): full-bleed — no sidebar, the split view
 * owns the viewport. This screen is the product.
 */
export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen overflow-hidden bg-bg">{children}</div>;
}
