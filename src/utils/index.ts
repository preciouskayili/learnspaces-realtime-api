import { supabaseClient } from "../config/supabase";

export function uint8ArrayToBase64(uint8Array: Uint8Array) {
  return Buffer.from(uint8Array).toString("base64");
}

export function base64ToUint8Array(base64String: string) {
  const buffer = Buffer.from(base64String, "base64");
  return new Uint8Array(buffer);
}

export async function isPodMember(
  podId: string,
  userId: string,
  token: string
) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase
    .from("pods")
    .select(
      `
      id,
      spaces:space (
        id,
        space_members (
          id,
          user_id
        )
      )
    `
    )
    .eq("spaces.space_members.id", userId)
    .eq("id", podId)
    .single();

  if (error) {
    console.error("Error checking pod membership:", error);
    return false;
  }

  return !!data;
}
