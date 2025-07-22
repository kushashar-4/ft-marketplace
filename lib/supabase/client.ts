import { createBrowserClient } from "@supabase/ssr";
// import { table } from "console";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function getTableData(tableName: string, filterVar?: string | null, filterValue?: string | number | null) {
  const supabase = createClient();
  let query = supabase.from(tableName).select();

  if (filterVar && filterValue) {
    query = query.eq(filterVar, filterValue);
  }
  const { data } = await query;

  return data;
}

export async function insertTableData(tableName: string, data: object) {
  const supabase = createClient();
  try {
    await supabase.from(tableName).insert(data);
    console.log(`Data inserted into ${tableName}:`, data);
  } catch (error) {
    console.error(`Error inserting data into ${tableName}:`, error);
    throw error;
  }
}

export async function updateTableData(tableName: string, data: object, filterVar: string, filterValue: string | number) {
  const supabase = createClient();
  await supabase.from(tableName).update(data).eq(filterVar, filterValue);
}

export async function deleteTableData(tableName: string, filterVar?: string | null, filterValue?: string | number | null) {
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