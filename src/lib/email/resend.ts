import { Resend } from "resend";

let resend: Resend | null = null;

export function getResend(): Resend {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    resend = new Resend(key);
  }
  return resend;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "SignalHunt <onboarding@resend.dev>";

function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SignalHunt</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#ea580c,#f97316);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                🎯 Signal<span style="font-weight:400;">Hunt</span>
              </h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#fafafa;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:13px;">
                © ${new Date().getFullYear()} SignalHunt — Discover intent signals from Reddit
              </p>
              <p style="margin:8px 0 0;color:#9ca3af;font-size:12px;">
                You received this email because of your SignalHunt account.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, url: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr>
        <td align="center">
          <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#ea580c,#f97316);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>`;
}

export async function sendWelcomeInviteEmail(
  to: string,
  inviteLink: string,
  plan: string,
) {
  const r = getResend();
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);

  const html = baseLayout(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;font-weight:700;">Welcome to SignalHunt! 🎉</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:15px;line-height:1.6;">
      Your <strong style="color:#ea580c;">${planName} plan</strong> is now active. You're all set to discover real buying intent signals from Reddit.
    </p>
    <p style="margin:0 0 4px;color:#374151;font-size:15px;line-height:1.6;">
      Click below to set up your password and access your dashboard:
    </p>
    ${ctaButton("Set Up Your Account →", inviteLink)}
    <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">
      This link expires in 24 hours. If you didn't make this purchase, you can safely ignore this email.
    </p>
  `);

  return r.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Welcome to SignalHunt — Your ${planName} plan is active!`,
    html,
  });
}

export async function sendMagicLinkEmail(to: string, magicLink: string) {
  const r = getResend();

  const html = baseLayout(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;font-weight:700;">Sign in to SignalHunt</h2>
    <p style="margin:0 0 4px;color:#374151;font-size:15px;line-height:1.6;">
      Click the button below to sign in to your account. No password needed.
    </p>
    ${ctaButton("Sign In →", magicLink)}
    <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">
      This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
    </p>
  `);

  return r.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Sign in to SignalHunt",
    html,
  });
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const r = getResend();

  const html = baseLayout(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;font-weight:700;">Reset your password</h2>
    <p style="margin:0 0 4px;color:#374151;font-size:15px;line-height:1.6;">
      We received a request to reset the password for your SignalHunt account. Click the button below to choose a new password.
    </p>
    ${ctaButton("Reset Password →", resetLink)}
    <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">
      This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
    </p>
  `);

  return r.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your SignalHunt password",
    html,
  });
}

export async function sendEmailConfirmationEmail(
  to: string,
  confirmLink: string,
) {
  const r = getResend();

  const html = baseLayout(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;font-weight:700;">Confirm your email</h2>
    <p style="margin:0 0 4px;color:#374151;font-size:15px;line-height:1.6;">
      Thanks for signing up for SignalHunt! Please confirm your email address to get started.
    </p>
    ${ctaButton("Confirm Email →", confirmLink)}
    <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">
      This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.
    </p>
  `);

  return r.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Confirm your SignalHunt email",
    html,
  });
}
