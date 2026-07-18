import { NextResponse } from 'next/server';
import { getMessages, toggleRead, deleteMessage } from '@/lib/db';

function isAuthorized(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7).trim();
  const adminPassword = (process.env.ADMIN_PASSWORD || 'admin123').trim();
  return token === adminPassword;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await getMessages();
    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages in admin API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const success = await toggleRead(id);
    if (!success) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Message status updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating message status in admin API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const success = await deleteMessage(id);
    if (!success) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Message deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting message in admin API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
