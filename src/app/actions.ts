"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ComplianceStatus } from "@/types/db";

async function currentUserId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

// Status changes always write to av_compliance_item_history alongside the
// items row update — that history trail is the one thing neither of
// Station Control's existing compliance models has (see SCOPE.md), so it
// isn't optional here.
export async function updateComplianceStatus(itemId: string, status: ComplianceStatus) {
  const supabase = await createClient();
  const changed_by = await currentUserId(supabase);

  const { error: updateError } = await supabase
    .from("av_compliance_items")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", itemId);
  if (updateError) throw new Error(updateError.message);

  const { error: historyError } = await supabase
    .from("av_compliance_item_history")
    .insert({ compliance_item_id: itemId, status, changed_by });
  if (historyError) throw new Error(historyError.message);

  revalidatePath("/");
}

export async function createComplianceItem(formData: FormData) {
  const supabase = await createClient();
  const changed_by = await currentUserId(supabase);

  const item_type_id = formData.get("item_type_id") as string;
  const station_code = (formData.get("station_code") as string) || null;
  const title = (formData.get("title") as string) || null;
  const cadence = (formData.get("cadence") as string) || null;
  const due_date = (formData.get("due_date") as string) || null;
  const owner = (formData.get("owner") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const status = (formData.get("status") as string) || "preparing";

  const { data, error } = await supabase
    .from("av_compliance_items")
    .insert({ item_type_id, station_code, title, cadence, due_date, owner, notes, status })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  // Seed the history trail with the item's starting status, same as any
  // later status change, so the audit trail always covers the full life
  // of the item from creation.
  const { error: historyError } = await supabase
    .from("av_compliance_item_history")
    .insert({ compliance_item_id: data.id, status, changed_by });
  if (historyError) throw new Error(historyError.message);

  revalidatePath("/");
  revalidatePath("/new");
}
