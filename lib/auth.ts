// lib/auth.ts
import { supabase } from "./supabase";

export const getUserRole = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data?.role || "applicant"; // Default to 'applicant' if no role is found
};