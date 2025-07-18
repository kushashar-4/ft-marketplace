import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

export async function getTableData(tableName: string, filterVar?: string | null, filterValue?: string | null) {
  const supabase = await createClient();
  let query = supabase.from(tableName).select();

  if (filterVar && filterValue) {
    query = query.eq(filterVar, filterValue);
  }
  const { data } = await query;

  return data;
}

export async function getAuth() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  return authData?.user;
}