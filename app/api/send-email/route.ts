// app/api/send-email/route.ts (Next.js 13+)
import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  const { email, subject, text, html } = await req.json();
  const msg = {
    to: email,
    from: 'kushashar13@gmail.com',
    subject: subject,
    text: text,
    html: html,
  };
  try {
    await sgMail.send(msg);
    return NextResponse.json({ success: true });
  } 
  catch (error: unknown) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}