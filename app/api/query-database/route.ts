import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const tableName = req.nextUrl.searchParams.get('tableName');

  if (!tableName) {
    return NextResponse.json({ error: 'Missing tableName parameter' }, { status: 400 });
  }

  const { data } = await supabase.from(tableName).select();
  return NextResponse.json({ data });
}