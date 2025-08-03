import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const subscription = body.data;
  const clerkUserId = subscription.payer.user_id; // e.g., user_abc123

  const currentPlan =
    subscription.items.find((item: any) => item.status === "active") ??
    subscription.items.find((item: any) => item.status === "upcoming") ??
    subscription.items.find((item: any) => item.status === "canceled");

  const planSlug = currentPlan?.plan?.slug ?? "basic";

  const { error } = await supabase
    .from("users")
    .update({ current_plan: planSlug })
    .eq("id", clerkUserId); // You use id as the Clerk ID

  if (error) {
    console.error("❌ Failed to update plan:", error);
    return new Response("Error updating plan", { status: 500 });
  }

  console.log(`✅ Updated user ${clerkUserId} to plan: ${planSlug}`);
  return new Response("OK", { status: 200 });
}
