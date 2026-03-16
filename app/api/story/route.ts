import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { esc, rateLimit, checkCsrf } from "@/lib/apiUtils";
import "@/lib/env";

const resend = new Resend(process.env.RESEND_API_KEY);

interface StoryPayload {
  name: string;
  email: string;
  story: string;
}

function validate(data: StoryPayload): string | null {
  if (!data.name?.trim()) return "Name is required.";
  if (!data.email?.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Enter a valid email address.";
  if (!data.story?.trim()) return "Story is required.";
  if (data.story.trim().length < 20) return "Please write at least a few sentences.";
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

    const body: StoryPayload = await req.json();
    const error = validate(body);
    if (error) return NextResponse.json({ success: false, message: error }, { status: 400 });

    const { name, email, story } = body;

    await resend.emails.send({
      from: "SwaadYatra Stories <onboarding@resend.dev>",
      to: "kanikakathuria2005@gmail.com",
      replyTo: email,
      subject: `[SwaadYatra] New Story from ${esc(name)}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">
          <div style="background:#E23744;padding:24px 32px;">
            <h2 style="color:#fff;margin:0;font-size:22px;">New Story Submission</h2>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">via SwaadYatra Happy Stories</p>
          </div>
          <div style="padding:32px;background:#fff;">
            <table style="width:100%;border-collapse:collapse;font-size:15px;">
              <tr>
                <td style="padding:10px 0;color:#888;width:80px;vertical-align:top;font-weight:600;">Name</td>
                <td style="padding:10px 0;color:#222;">${esc(name)}</td>
              </tr>
              <tr style="border-top:1px solid #f0f0f0;">
                <td style="padding:10px 0;color:#888;vertical-align:top;font-weight:600;">Email</td>
                <td style="padding:10px 0;"><a href="mailto:${esc(email)}" style="color:#E23744;">${esc(email)}</a></td>
              </tr>
              <tr style="border-top:1px solid #f0f0f0;">
                <td style="padding:10px 0;color:#888;vertical-align:top;font-weight:600;">Story</td>
                <td style="padding:10px 0;color:#222;white-space:pre-wrap;">${esc(story)}</td>
              </tr>
            </table>
          </div>
          <div style="background:#fafafa;padding:16px 32px;border-top:1px solid #eee;font-size:12px;color:#aaa;">
            Sent from SwaadYatra story submission · ${new Date().toUTCString()}
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Your story has been submitted!" });
  } catch (err) {
    console.error("[story/route] Error:", err);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
