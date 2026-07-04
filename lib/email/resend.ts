import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM =
  process.env.RESEND_FROM_EMAIL ??
  "Groundcrew <onboarding@groundcrew.online>";

/**
 * Send the magic-link / OTP email to a portal visitor.
 */
export async function sendPortalOtp(to: string, code: string, projectName: string) {
  const resend = getResend();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Your Groundcrew access code: ${code}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="font-size: 20px; font-weight: 600;">Your access code</h2>
        <p>Enter this code to access the <strong>${projectName}</strong> onboarding portal:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 16px 0; font-family: monospace;">
          ${code}
        </div>
        <p style="color: #666; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">Sent by Groundcrew</p>
      </div>
    `,
  });
}

/**
 * Send a chase / reminder email to a client who hasn't completed portal steps.
 */
export async function sendChaseEmail(
  to: string,
  clientName: string,
  projectName: string,
  portalUrl: string,
  pendingSteps: string[],
  chaseNumber: number,
) {
  const resend = getResend();

  const stepList = pendingSteps.map((s) => `<li>${s}</li>`).join("");

  const subject =
    chaseNumber === 1
      ? `Action needed: ${projectName} onboarding`
      : chaseNumber === 2
        ? `Reminder: ${projectName} — items still pending`
        : `Final reminder: ${projectName} onboarding`;

  return resend.emails.send({
    from: FROM,
    to,
    subject,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 540px; margin: 0 auto;">
        <h2 style="font-size: 20px; font-weight: 600;">Hi ${clientName},</h2>
        <p>We're getting everything ready for <strong>${projectName}</strong>, but we still need a few things from your side:</p>
        <ul style="padding-left: 20px; line-height: 1.8;">
          ${stepList}
        </ul>
        <p>
          <a href="${portalUrl}" 
             style="display: inline-block; background: #111; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
            Open your portal
          </a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">
          ${chaseNumber >= 3 ? "This is our final automated reminder. Your project manager will follow up directly if these items remain outstanding." : "We'll send a follow-up if items are still pending."}
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">Sent by Groundcrew on behalf of your project team.</p>
      </div>
    `,
  });
}

/**
 * Send a "Cleared for takeoff" notification to the project team.
 */
export async function sendClearedNotification(
  to: string,
  projectName: string,
  clientName: string,
  itemCount: number,
) {
  const resend = getResend();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `✓ Cleared for takeoff: ${projectName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="font-size: 20px; font-weight: 600;">Cleared for takeoff</h2>
        <p><strong>${projectName}</strong> for ${clientName} has been fully reviewed and pushed.</p>
        <p>${itemCount} items verified and sent to your project management tool.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">Sent by Groundcrew</p>
      </div>
    `,
  });
}
