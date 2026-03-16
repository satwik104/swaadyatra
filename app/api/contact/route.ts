import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { esc, rateLimit, checkCsrf } from "@/lib/apiUtils";
import "@/lib/env";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function validate(data: ContactPayload): string | null {
  const { name, email, subject, message } = data;
  if (!name?.trim()) return "Name is required.";
  if (!email?.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  if (!subject?.trim()) return "Subject is required.";
  if (!message?.trim()) return "Message is required.";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const csrfError = checkCsrf(req);
    if (csrfError) return NextResponse.json({ success: false, message: csrfError }, { status: 403 });

    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(ip)) {
      return NextResponse.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body: ContactPayload = await req.json();
    const error = validate(body);
    if (error) return NextResponse.json({ success: false, message: error }, { status: 400 });

    const { name, email, subject, message } = body;

    await resend.emails.send({
      from: "SwaadYatra Contact <onboarding@resend.dev>",
      to: "kanikakathuria2005@gmail.com",
      replyTo: email,
      subject: `[SwaadYatra] ${esc(subject)}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">
          <div style="background:#E23744;padding:24px 32px;">
            <h2 style="color:#fff;margin:0;font-size:22px;">New Contact Form Submission</h2>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">via SwaadYatra</p>
          </div>
          <div style="padding:32px;background:#fff;">
            <table style="width:100%;border-collapse:collapse;font-size:15px;">
              <tr>
                <td style="padding:10px 0;color:#888;width:90px;vertical-align:top;font-weight:600;">Name</td>
                <td style="padding:10px 0;color:#222;">${esc(name)}</td>
              </tr>
              <tr style="border-top:1px solid #f0f0f0;">
                <td style="padding:10px 0;color:#888;vertical-align:top;font-weight:600;">Email</td>
                <td style="padding:10px 0;color:#222;"><a href="mailto:${esc(email)}" style="color:#E23744;">${esc(email)}</a></td>
              </tr>
              <tr style="border-top:1px solid #f0f0f0;">
                <td style="padding:10px 0;color:#888;vertical-align:top;font-weight:600;">Subject</td>
                <td style="padding:10px 0;color:#222;">${esc(subject)}</td>
              </tr>
              <tr style="border-top:1px solid #f0f0f0;">
                <td style="padding:10px 0;color:#888;vertical-align:top;font-weight:600;">Message</td>
                <td style="padding:10px 0;color:#222;white-space:pre-wrap;">${esc(message)}</td>
              </tr>
            </table>
          </div>
          <div style="background:#fafafa;padding:16px 32px;border-top:1px solid #eee;font-size:12px;color:#aaa;">
            Sent from SwaadYatra contact form · ${new Date().toUTCString()}
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Your message has been sent successfully." });
  } catch (err) {
    console.error("[contact/route] Error:", err);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
