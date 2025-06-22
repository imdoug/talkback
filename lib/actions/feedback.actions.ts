"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

export const createFeedback = async (formData: {
  rating: number;
  note?: string;
  companionId: string
}) => {
      const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("feedbacks")
    .insert({
        companion_id: formData.companionId,
        user_id: author,
        rating: formData.rating,
        note: formData.note || "",
    })
    .select();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create feedback");
  }

  return data[0];
};
