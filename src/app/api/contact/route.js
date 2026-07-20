import { NextResponse } from 'next/server';
import { addMessage } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields (name, email, subject, message) are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const saved = await addMessage({ name, email, subject, message });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!', data: saved },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in contact form submission API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}
