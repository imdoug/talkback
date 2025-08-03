import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const event = await req.json();

  if (event.type === "subscription.updated") {
    const clerkUserId = event.data.id;
    const plan = event.data.plan?.name?.toLowerCase() ?? "free";

    console.log(`🔁 Clerk subscription updated: ${clerkUserId} → ${plan}`);

    // Update Clerk metadata
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        subscription: { plan },
      },
    });

    // Update Supabase profile
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ current_plan: plan })
      .eq("id", clerkUserId);

    if (error) {
      console.error("❌ Supabase update error:", error);
      return new NextResponse("Supabase error", { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return new NextResponse("Unhandled event", { status: 400 });
}
