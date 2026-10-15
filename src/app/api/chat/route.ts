import { NextResponse } from 'next/server';
import { UserRole } from '@/lib/permissions';

export type ChatMessage = {
  id: string;
  patientId: string;
  senderRole: UserRole | 'patient';
  senderName: string;
  text: string;
  timestamp: string;
  isRead?: boolean;
  type?: 'text' | 'diet_assigned' | 'prescription' | 'session_logged';
  meta?: Record<string, any>;
};

declare global {
  var _cerrahChatStore: ChatMessage[] | undefined;
}

if (!global._cerrahChatStore) {
  global._cerrahChatStore = [];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    let messages = global._cerrahChatStore || [];
    if (patientId) {
      messages = messages.filter(m => m.patientId === patientId || m.patientId === 'all');
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, senderRole, senderName, text, type, meta } = body;

    if (!patientId || !text) {
      return NextResponse.json({ error: 'Patient ID and message text are required' }, { status: 400 });
    }

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      patientId,
      senderRole: senderRole || 'doctor',
      senderName: senderName || 'فريق عيادة سيرة 2',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
      type: type || 'text',
      meta: meta || undefined,
    };

    if (!global._cerrahChatStore) {
      global._cerrahChatStore = [];
    }
    global._cerrahChatStore.push(newMessage);

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error posting chat message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
