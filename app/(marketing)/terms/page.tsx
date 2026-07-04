import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="July 4, 2026">
      <p>
        These Terms of Service ("Terms") govern your access to and use of the
        Groundcrew platform ("Service") operated by Groundcrew ("we," "us," or
        "our"). By accessing or using the Service, you agree to be bound by
        these Terms.
      </p>

      <h2>1. Service Description</h2>
      <p>
        Groundcrew is a B2B software-as-a-service platform that automates
        client onboarding by extracting deliverables from signed Statements of
        Work (SOWs), creating project plans in third-party project management
        tools, generating branded client portals, and sending automated
        follow-up communications.
      </p>

      <h2>2. Eligibility &amp; Accounts</h2>
      <p>
        You must be at least 18 years old and have the authority to bind your
        organization to these Terms. Each account is tied to an organization.
        You are responsible for maintaining the confidentiality of your
        authentication credentials and for all activity under your account.
      </p>

      <h2>3. Client Portal Access</h2>
      <p>
        Your end clients may access project-specific portals via magic links
        and one-time passcodes. You are responsible for ensuring your clients
        are informed about how their data is used. Portal access does not
        create an account or direct relationship between the end client and
        Groundcrew.
      </p>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Upload malicious files or content that violates applicable law</li>
        <li>Attempt to circumvent rate limits, authentication, or security controls</li>
        <li>Use the Service to process data subject to HIPAA, PCI-DSS, or similar regulated standards without our prior written consent</li>
        <li>Reverse-engineer, scrape, or interfere with the Service infrastructure</li>
        <li>Resell access to the Service without authorization</li>
      </ul>

      <h2>5. Data &amp; Intellectual Property</h2>
      <p>
        You retain ownership of all documents, SOWs, and content you upload
        ("Your Content"). You grant us a limited license to process Your
        Content solely to provide the Service. We do not use Your Content to
        train AI models. Extracted data remains yours.
      </p>
      <p>
        The Service, its design, code, and documentation are our intellectual
        property. Nothing in these Terms transfers ownership of our technology
        to you.
      </p>

      <h2>6. Third-Party Integrations</h2>
      <p>
        The Service connects to third-party platforms (Asana, OpenAI, email
        providers). Your use of those platforms is subject to their respective
        terms. We are not liable for third-party outages or policy changes.
        You authorize us to act on your behalf when pushing data to connected
        tools.
      </p>

      <h2>7. AI-Generated Content</h2>
      <p>
        Extraction results are generated using AI and may contain errors. You
        are responsible for reviewing all extracted deliverables, milestones,
        and budget items before acting on them. We provide confidence scores
        and citation grounding but do not guarantee accuracy.
      </p>

      <h2>8. Payment &amp; Billing</h2>
      <p>
        Paid plans are billed in advance on a monthly or annual basis.
        Refunds are available within 14 days of initial purchase if the
        Service has not been materially used. We may change pricing with
        30 days' notice.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, our total liability arising
        from or related to the Service shall not exceed the amount you paid us
        in the 12 months preceding the claim. We are not liable for indirect,
        incidental, special, or consequential damages.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        You agree to indemnify us against claims arising from your use of the
        Service, Your Content, or your violation of these Terms.
      </p>

      <h2>11. Termination</h2>
      <p>
        Either party may terminate at any time. Upon termination, we will
        delete your data within 30 days unless legally required to retain it.
        You may export Your Content before termination.
      </p>

      <h2>12. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be
        communicated via email or in-app notice at least 14 days before they
        take effect. Continued use after changes constitutes acceptance.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of Delaware, USA,
        without regard to conflict of law principles. Disputes shall be
        resolved through binding arbitration under the rules of the American
        Arbitration Association.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these Terms? Email us at{" "}
        <a href="mailto:legal@groundcrew.online">legal@groundcrew.online</a>.
      </p>
    </LegalPage>
  );
}
