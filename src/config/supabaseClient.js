import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn("⚠️ Variables de Supabase no configuradas. Funcionará en modo local.");
}

// createClient valida la URL y tira una excepción con valores vacíos, lo que
// rompería el montaje de toda la app — solo se crea el cliente real si están
// configuradas ambas variables.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient("https://placeholder.supabase.co", "placeholder-anon-key");
