import { Suspense } from "react";
import { AppTopbar } from "@/components/app-topbar";
import { IntakeFlow } from "@/components/upload/intake-flow";

export const metadata = { title: "New onboarding" };

export default function UploadPage() {
  return (
    <>
      <AppTopbar title="New onboarding" />
      <main id="main" className="p-6">
        <Suspense fallback={null}>
          <IntakeFlow />
        </Suspense>
      </main>
    </>
  );
}
