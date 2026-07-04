import { CheckoutDemo } from "@/components/billing/checkout-demo";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <CheckoutDemo />
    </main>
  );
}
