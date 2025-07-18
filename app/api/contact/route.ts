import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, phone, subject, message } = body

  try {
    const data = await resend.emails.send({
      from: 'Yooly Contact <yooly@dougmoreira.com>',        //your verified domain
      to: 'contact@dougmoreira.com',                      // ✅ your inbox (can be Gmail or same domain)
      replyTo: email,                                  // allows you to hit "reply" to user directly
      subject: `📬 New Contact Form: ${subject}`,
      html: `
        <h2>New message from Yooly Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
