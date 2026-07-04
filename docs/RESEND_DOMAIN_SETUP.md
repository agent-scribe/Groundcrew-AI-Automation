# Resend Custom Domain Setup — groundcrew.online

To send emails from `onboarding@groundcrew.online` instead of `@resend.dev`,
add DNS records from Resend to your domain registrar.

## Steps

1. Go to https://resend.com/domains
2. Click "Add Domain" → enter `groundcrew.online`
3. Add the DNS records Resend provides (SPF, DKIM, MX)
4. Wait for verification (5-30 minutes)
5. Once verified, emails send from `@groundcrew.online`

## Environment Variable

Already configured. Override with:
```
RESEND_FROM_EMAIL=Groundcrew <onboarding@groundcrew.online>
```
