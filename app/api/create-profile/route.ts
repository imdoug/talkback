import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Use SUPABASE_SERVICE_ROLE_KEY (not anon)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


export async function POST() {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const clerkId = user.id;
  const email = user.emailAddresses[0].emailAddress;
  const firstName = user.firstName ?? "";
  const lastName = user.lastName ?? "";

  console.log("Inserting user profile:", { clerkId, email });

  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("id", clerkId)
    .single();

  if (existing) {
    console.log("🔁 User already exists:", clerkId);
    return NextResponse.json({ message: "User already exists" });
  }

  const { error } = await supabaseAdmin.from("profiles").insert({
    id: clerkId,
    email,
    first_name: firstName,
    last_name: lastName,
    current_plan: "free",
  });

  if (error) {
    console.error("❌ Error creating profile:", error);
    return new NextResponse("Failed to create profile", { status: 500 });
  }

  console.log("✅ Profile created for user:", clerkId);
  return NextResponse.json({ success: true });
}

