"use client";

import { useState } from "react";
import { MagicLinkGate } from "@/components/portal/magic-link-gate";
import { PreflightChecklist } from "@/components/portal/preflight-checklist";

export function PortalShell({ token }: { token: string }) {
  const [verified, setVerified] = useState(false);
  void token; // demo build: single fixture portal for any token
  return verified ? (
    <PreflightChecklist />
  ) : (
    <MagicLinkGate
      clientEmail="dana@acmeoutdoor.com"
      onVerified={() => setVerified(true)}
    />
  );
}
