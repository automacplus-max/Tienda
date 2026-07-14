import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Variables de Supabase no configuradas. Funcionará en modo local.");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
