import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { esc, rateLimit, checkCsrf, isAllowedImageMime } from "@/lib/apiUtils";
import "@/lib/env";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file
const MAX_FILES = 5;

export async function POST(req: NextRequest) {
  try {
    const csrfError = checkCsrf(req);
    if (csrfError) return NextResponse.json({ success: false, message: csrfError }, { status: 403 });

    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(ip, 3)) {
      return NextResponse.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
    }

    const formData = await req.formData();

    const vendorName    = formData.get("vendorName")    as string;
    const foodSpotName  = formData.get("foodSpotName")  as string;
    const city          = formData.get("city")          as string;
    const famousFood    = formData.get("famousFood")    as string;
    const contactNumber = formData.get("contactNumber") as string;
    const description   = formData.get("description")  as string;
    const images        = formData.getAll("images")     as File[];

    if (!vendorName || !foodSpotName || !city || !famousFood || !contactNumber || !description) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }
    if (!/^[0-9]{10}$/.test(contactNumber)) {
      return NextResponse.json({ success: false, message: "Enter a valid 10-digit contact number." }, { status: 400 });
    }

    const validImages = images.filter((f) => f && f.size > 0);
    if (validImages.length > MAX_FILES) {
      return NextResponse.json({ success: false, message: `Maximum ${MAX_FILES} images allowed.` }, { status: 400 });
    }
    for (const file of validImages) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, message: `Each image must be under 5 MB. "${file.name}" exceeds the limit.` }, { status: 400 });
      }
      const allowed = await isAllowedImageMime(file);
      if (!allowed) {
        return NextResponse.json({ success: false, message: `"${file.name}" is not a valid image file.` }, { status: 400 });
      }
    }

    const attachments: { filename: string; content: Buffer }[] = [];
    for (const file of validImages) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({ filename: file.name, content: buffer });
    }

    await resend.emails.send({
      from: "SwaadYatra Listings <onboarding@resend.dev>",
      to: "jainkanika708@gmail.com",
      subject: `[SwaadYatra] New Food Spot Listing — ${esc(foodSpotName)}, ${esc(city)}`,
      attachments,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">
          <div style="background:#E23744;padding:24px 32px;">
            <h2 style="color:#fff;margin:0;font-size:22px;">New Food Spot Listing Request</h2>
            <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">via SwaadYatra · List Your Food Spot</p>
          </div>
          <div style="padding:32px;background:#fff;">
            <table style="width:100%;border-collapse:collapse;font-size:15px;">
              <tr>
                <td style="padding:10px 0;color:#888;width:140px;vertical-align:top;font-weight:600;">Vendor Name</td>
                <td style="padding:10px 0;color:#222;">${esc(vendorName)}</td>
              </tr>
              <tr style="border-top:1px solid #f0f0f0;">
                <td style="padding:10px 0;color:#888;vertical-align:top;font-weight:600;">Food Spot Name</td>
                <td style="padding:10px 0;color:#222;">${esc(foodSpotName)}</td>
              </tr>
              <tr style="border-top:1px solid #f0f0f0;">
                <td style="padding:10px 0;color:#888;vertical-align:top;font-weight:600;">City</td>
                <td style="padding:10px 0;color:#222;">${esc(city)}</td>
              </tr>
              <tr style="border-top:1px solid #f0f0f0;">
                <td style="padding:10px 0;color:#888;vertical-align:top;font-weight:600;">Famous Food</td>
                <td style="padding:10px 0;color:#222;">${esc(famousFood)}</td>
              </tr>
              <tr style="border-top:1px solid #f0f0f0;">
                <td style="padding:10px 0;color:#888;vertical-align:top;font-weight:600;">Contact Number</td>
                <td style="padding:10px 0;color:#222;">${esc(contactNumber)}</td>
              </tr>
              <tr style="border-top:1px solid #f0f0f0;">
                <td style="padding:10px 0;color:#888;vertical-align:top;font-weight:600;">Description</td>
                <td style="padding:10px 0;color:#222;white-space:pre-wrap;">${esc(description)}</td>
              </tr>
              <tr style="border-top:1px solid #f0f0f0;">
                <td style="padding:10px 0;color:#888;vertical-align:top;font-weight:600;">Images</td>
                <td style="padding:10px 0;color:#222;">
                  ${attachments.length > 0 ? `${attachments.length} image(s) attached — see attachments below.` : "No images uploaded."}
                </td>
              </tr>
            </table>
          </div>
          <div style="background:#fafafa;padding:16px 32px;border-top:1px solid #eee;font-size:12px;color:#aaa;">
            Submitted via SwaadYatra · ${new Date().toUTCString()}
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Your listing has been submitted successfully! We'll review it within 24–48 hours." });
  } catch (err) {
    console.error("[vendor/route] Error:", err);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
