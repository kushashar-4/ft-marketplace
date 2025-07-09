import { createBrowserClient } from "@supabase/ssr";
import { table } from "console";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function getTableData(tableName: string, filterVar?: string | null, filterValue?: any | number | null) {
  const supabase = createClient();
  let query = supabase.from(tableName).select();

  if (filterVar && filterValue) {
    query = query.eq(filterVar, filterValue);
  }
  const { data } = await query;

  return data;
}

export async function insertData(tableName: string, data: any) {
  const supabase = createClient();
  await supabase.from(tableName).insert(data);
}

export async function deleteData(tableName: string, filterVar?: string | null, filterValue?: string | number | null) {
  const supabase = createClient();
  if(filterVar && filterValue) {
    await supabase.from(tableName).delete().eq(filterVar, filterValue);
  }
}

export async function getAuth() {
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  return authData?.user;
}