import { NextResponse } from 'next/server';
import { getMessages, toggleRead, deleteMessage } from '@/lib/db';

export const dynamic = 'force-dynamic';

function getAdminPasswordConfig() {
  // Directly check the exact names we expect, since bundlers strip Object.keys(process.env) at compile-time on Vercel
  const directKeys = [
    'ADMIN_PASSWORD', 
    'admin_password', 
    'Admin_Password', 
    'NEXT_PUBLIC_ADMIN_PASSWORD',
    'next_public_admin_password'
  ];

  for (const key of directKeys) {
    if (process.env[key] !== undefined && process.env[key] !== '') {
      return {
        password: process.env[key].trim(),
        exists: true,
        keyUsed: key
      };
    }
  }

  const keys = Object.keys(process.env);
  
  // Find case-insensitive match for ADMIN_PASSWORD in keys list as fallback
  const exactMatch = keys.find(k => k.toUpperCase() === 'ADMIN_PASSWORD');
  if (exactMatch) {
    return {
      password: process.env[exactMatch].trim(),
      exists: true,
      keyUsed: exactMatch
    };
  }

  // Find any key containing "PASSWORD" and "ADMIN" or "AVAIS"
  const broadMatch = keys.find(k => {
    const uk = k.toUpperCase();
    return uk.includes('PASSWORD') && (uk.includes('ADMIN') || uk.includes('AVAIS') || uk.includes('PORTFOLIO'));
  });
  if (broadMatch) {
    return {
      password: process.env[broadMatch].trim(),
      exists: true,
      keyUsed: broadMatch
    };
  }

  // Fallback default
  return {
    password: 'admin123',
    exists: false,
    keyUsed: null
  };
}

function isAuthorized(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7).trim();
  const config = getAdminPasswordConfig();
  return token === config.password;
}

export async function GET(request) {
  const config = getAdminPasswordConfig();
  
  if (!isAuthorized(request)) {
    // List all safe key names to inspect what is configured
    const safeKeys = Object.keys(process.env).filter(k => 
      !k.startsWith('VC_') && 
      !k.startsWith('VERCEL_') && 
      !k.startsWith('AWS_') && 
      !k.startsWith('npm_') && 
      !k.startsWith('NODE_') &&
      k !== 'PATH'
    );

    return NextResponse.json({ 
      error: 'Unauthorized', 
      envVarExists: config.exists,
      keyUsed: config.keyUsed,
      availableKeys: safeKeys,
      message: config.exists 
        ? `Invalid password.` 
        : `Password is not set in Vercel. Checked keys: [${safeKeys.join(', ')}]. Please configure ADMIN_PASSWORD in your Vercel Dashboard and Redeploy.`
    }, { status: 401 });
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
