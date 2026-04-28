import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const { pathname, referrer, userAgent } = await request.json()

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: process.env.NOTIFY_EMAIL!,
    subject: 'Someone visited your demo',
    html: `
      <p><strong>Page:</strong> ${pathname}</p>
      <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
      <p><strong>Referrer:</strong> ${referrer || 'direct'}</p>
      <p><strong>User Agent:</strong> ${userAgent || 'unknown'}</p>
    `,
  })

  return NextResponse.json({ ok: true })
}
