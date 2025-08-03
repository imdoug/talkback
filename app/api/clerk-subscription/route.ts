import { NextResponse } from "next/server";
import { clerkClient, verifyWebhookSignature } from "@clerk/nextjs/server";
import verifyW
import { createClient } from "@supabase/supabase-js";

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("clerk-signature") || "";

  // Verify webhook is legit
  const isValid = await verifyWebhookSignature({
    secret: process.env.CLERK_WEBHOOK_SECRET!,
    payload: body,
    signature,
  });

  if (!isValid) {
    console.warn("❌ Invalid Clerk webhook signature");
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(body);

  // Listen to subscription updates (you can add other types too)
  if (event.type === "subscription.updated") {
    const clerkUserId = event.data.id;
    const plan = event.data.plan?.name?.toLowerCase() ?? "free";

    console.log(`🔁 Subscription changed for ${clerkUserId}: ${plan}`);

    // ✅ Update Clerk metadata
    await clerkClient.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        subscription: { plan },
      },
    });

    // ✅ Update Supabase
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ current_plan: plan })
      .eq("id", clerkUserId);

    if (error) {
      console.error("❌ Failed to update Supabase:", error);
      return new NextResponse("Failed to update Supabase", { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return new NextResponse("Unhandled event type", { status: 400 });
}
