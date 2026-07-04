import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="July 4, 2026">
      <p>
        This Privacy Policy describes how Groundcrew ("we," "us," or "our")
        collects, uses, and protects information when you use our platform
        ("Service"). We are committed to protecting your privacy and handling
        data transparently.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>Information you provide</h3>
      <ul>
        <li><strong>Account data:</strong> email address and organization name when you sign up via magic link authentication</li>
        <li><strong>Uploaded content:</strong> Statements of Work (SOWs) and related project documents</li>
        <li><strong>Project data:</strong> client names, email addresses, project names, and onboarding details you enter</li>
        <li><strong>Integration credentials:</strong> OAuth tokens for connected services (Asana)</li>
      </ul>

      <h3>Information collected automatically</h3>
      <ul>
        <li><strong>Usage data:</strong> pages visited, features used, timestamps</li>
        <li><strong>Device data:</strong> IP address, browser type, operating system</li>
        <li><strong>Error data:</strong> crash reports and performance metrics via Sentry</li>
      </ul>

      <h3>Information from third parties</h3>
      <ul>
        <li><strong>Authentication providers:</strong> Supabase Auth provides your verified email</li>
        <li><strong>Connected tools:</strong> workspace and project metadata from Asana when you connect your account</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>Provide, maintain, and improve the Service</li>
        <li>Process uploaded SOWs using AI extraction (OpenAI)</li>
        <li>Create and manage project plans in your connected tools</li>
        <li>Send transactional emails: magic links, OTP codes, chase reminders</li>
        <li>Monitor errors and performance</li>
        <li>Enforce our Terms of Service and protect against abuse</li>
      </ul>

      <h2>3. AI Processing</h2>
      <p>
        We use OpenAI's API to extract structured data from your uploaded SOWs.
        Document content is sent to OpenAI for processing and is subject to{" "}
        <a href="https://openai.com/policies/api-data-usage" target="_blank" rel="noopener noreferrer">
          OpenAI's API data usage policy
        </a>
        . OpenAI does not use data submitted via their API to train models. We
        do not use your documents to train our own models.
      </p>

      <h2>4. Data Sharing</h2>
      <p>We share data only as follows:</p>
      <ul>
        <li><strong>Service providers:</strong> Supabase (database &amp; auth), OpenAI (extraction), Resend (email), Upstash (rate limiting), Vercel (hosting), Sentry (error tracking)</li>
        <li><strong>Connected tools:</strong> data you explicitly push to Asana or other integrations</li>
        <li><strong>Your clients:</strong> project-specific information visible in client portals</li>
        <li><strong>Legal compliance:</strong> when required by law, subpoena, or to protect rights and safety</li>
      </ul>
      <p>We do not sell personal information to third parties.</p>

      <h2>5. Data Storage &amp; Security</h2>
      <p>
        Data is stored in Supabase (hosted on AWS) with row-level security
        policies. Files are stored in encrypted cloud storage. All data in
        transit uses TLS 1.2+. We implement rate limiting, input validation,
        security headers (CSP, HSTS, X-Frame-Options), and authentication
        checks on all protected endpoints.
      </p>

      <h2>6. Data Retention</h2>
      <ul>
        <li><strong>Account data:</strong> retained while your account is active, deleted within 30 days of account termination</li>
        <li><strong>Uploaded documents:</strong> retained until you delete them or terminate your account</li>
        <li><strong>Portal access logs:</strong> retained for 90 days</li>
        <li><strong>Error logs:</strong> retained for 30 days</li>
      </ul>

      <h2>7. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Correct inaccurate data</li>
        <li>Delete your data ("right to be forgotten")</li>
        <li>Export your data in a portable format</li>
        <li>Object to or restrict certain processing</li>
        <li>Withdraw consent at any time</li>
      </ul>
      <p>
        To exercise these rights, email{" "}
        <a href="mailto:privacy@groundcrew.online">privacy@groundcrew.online</a>.
        We will respond within 30 days.
      </p>

      <h2>8. Client Portal Users</h2>
      <p>
        If you access Groundcrew through a client portal, your email address
        and portal activity are processed on behalf of the organization that
        invited you. For questions about how your data is used, contact the
        organization directly. We act as a data processor on their behalf.
      </p>

      <h2>9. International Transfers</h2>
      <p>
        Data may be processed in the United States. By using the Service, you
        consent to transfer of data to the US. We rely on standard contractual
        clauses and service provider agreements to protect transferred data.
      </p>

      <h2>10. Children's Privacy</h2>
      <p>
        The Service is not intended for individuals under 18. We do not
        knowingly collect data from children.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. We will notify you of
        material changes via email or in-app notice. The "Last updated" date
        at the top reflects the most recent revision.
      </p>

      <h2>12. Contact</h2>
      <p>
        For privacy-related inquiries:{" "}
        <a href="mailto:privacy@groundcrew.online">privacy@groundcrew.online</a>
      </p>
    </LegalPage>
  );
}
