import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // 1. Read body as buffer (required for svix)
    const payload = await req.arrayBuffer();
    const body = Buffer.from(payload);

    // 2. Get headers needed for signature verification
    const svix_id = req.headers.get("svix-id")!;
    const svix_timestamp = req.headers.get("svix-timestamp")!;
    const svix_signature = req.headers.get("svix-signature")!;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ error: "Missing headers" }, { status: 400 });
    }

    // 3. Verify signature
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });

    const { type, data } = evt as {
      type: string;
      data: any;
    };

    // 4. Only handle subscription.updated (or subscription.created if needed)
    if (type === "subscription.updated") {
      const clerkUserId = data?.payer?.user_id;
      const planSlug = data?.items?.find(
        (item: any) => item.status === "active" || item.status === "upcoming"
      )?.plan?.slug;

      if (!clerkUserId || !planSlug) {
        console.warn("Missing user_id or active plan");
        return NextResponse.json({ success: false }, { status: 400 });
      }

      // 5. Update Supabase user record
      const { error } = await supabase
        .from("users")
        .update({ current_plan: planSlug })
        .eq("id", clerkUserId); // You're using `id`, not `clerk_user_id`

      if (error) {
        console.error("Supabase update error", error);
        return NextResponse.json({ success: false }, { status: 500 });
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook handler error", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
