export function mapSupabaseUser(supabaseUser) {
  const meta = supabaseUser.user_metadata || {};
  return {
    id: supabaseUser.id,
    name: meta.full_name || meta.name || supabaseUser.email?.split("@")[0] || "Usuario",
    email: supabaseUser.email || "",
    avatar: meta.avatar_url || meta.picture || null,
  };
}
