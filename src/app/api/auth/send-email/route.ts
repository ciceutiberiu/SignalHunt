import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendEmailConfirmationEmail,
  sendPasswordResetEmail,
} from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json({ error: "Missing email or type" }, { status: 400 });
    }

    const appUrl = process.env.APP_URL || "https://signal-hunt-fawn.vercel.app";
    const supabase = createAdminClient();

    if (type === "signup") {
      // User already created by signUp() — generate a magiclink to confirm
      const { data, error } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email,
      });

      if (error || !data?.properties?.hashed_token) {
        return NextResponse.json(
          { error: error?.message || "Failed to generate confirmation link" },
          { status: 500 }
        );
      }

      const confirmUrl = `${appUrl}/auth/confirm?token_hash=${data.properties.hashed_token}&type=magiclink&next=/dashboard`;
      await sendEmailConfirmationEmail(email, confirmUrl);
      return NextResponse.json({ success: true });
    }

    if (type === "recovery") {
      const { data, error } = await supabase.auth.admin.generateLink({
        type: "recovery",
        email,
      });

      if (error || !data?.properties?.hashed_token) {
        // Don't reveal if email exists or not
        return NextResponse.json({ success: true });
      }

      const confirmUrl = `${appUrl}/auth/confirm?token_hash=${data.properties.hashed_token}&type=recovery&next=/reset-password`;
      await sendPasswordResetEmail(email, confirmUrl);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send email" },
      { status: 500 }
    );
  }
}
