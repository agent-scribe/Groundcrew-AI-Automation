import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="July 4, 2026">
      <p>
        This Cookie Policy explains how Groundcrew ("we," "us," or "our") uses
        cookies and similar technologies when you visit our website and use our
        platform.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help the site remember your preferences and understand
        how you interact with it. Similar technologies include local storage
        and session storage.
      </p>

      <h2>2. Cookies We Use</h2>

      <h3>Strictly Necessary Cookies</h3>
      <p>
        These cookies are required for the Service to function and cannot be
        disabled.
      </p>
      <ul>
        <li><strong>Authentication session:</strong> Supabase auth cookies that maintain your login state. Expire when you sign out or after 7 days of inactivity.</li>
        <li><strong>CSRF protection:</strong> tokens that prevent cross-site request forgery attacks. Session-scoped.</li>
      </ul>

      <h3>Functional Cookies</h3>
      <ul>
        <li><strong>Theme preference:</strong> stores your light/dark mode choice. Persistent, 1 year.</li>
      </ul>

      <h3>Analytics &amp; Performance Cookies</h3>
      <ul>
        <li><strong>Sentry:</strong> error tracking and performance monitoring. Collects anonymized session data to help us diagnose issues. 30-day retention.</li>
      </ul>

      <h2>3. Cookies We Do Not Use</h2>
      <p>
        Groundcrew does <strong>not</strong> use:
      </p>
      <ul>
        <li>Advertising or targeting cookies</li>
        <li>Third-party social media tracking pixels</li>
        <li>Cross-site tracking cookies</li>
      </ul>

      <h2>4. Client Portal Cookies</h2>
      <p>
        The client portal uses only strictly necessary cookies for magic-link
        authentication. No analytics or tracking cookies are set in the portal
        experience.
      </p>

      <h2>5. Managing Cookies</h2>
      <p>
        You can control cookies through your browser settings. Most browsers
        allow you to block or delete cookies. Note that blocking strictly
        necessary cookies will prevent you from using the Service.
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a></li>
        <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Firefox</a></li>
        <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Edge</a></li>
      </ul>

      <h2>6. Updates</h2>
      <p>
        We may update this Cookie Policy as our use of cookies changes. Check
        the "Last updated" date at the top for the latest version.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about cookies? Email{" "}
        <a href="mailto:privacy@groundcrew.online">privacy@groundcrew.online</a>.
      </p>
    </LegalPage>
  );
}
