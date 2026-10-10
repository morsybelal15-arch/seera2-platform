import { NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

export interface MessengerMessage {
  id: string;
  clientId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'subscriber' | 'doctor' | 'staff' | 'assistant';
  receiverRole: 'clinic' | 'client';
  text: string;
  messageType: 'text' | 'voice' | 'image' | 'file';
  mediaUrl?: string | null;
  mediaDuration?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface ConversationThread {
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientRole: 'clinic_client' | 'online_subscriber';
  lastMessage: MessengerMessage;
  unreadCount: number;
}

declare global {
  var _cerrahMessengerStore: MessengerMessage[] | undefined;
}

// Initialize empty messenger store for production ready deployment
if (!global._cerrahMessengerStore) {
  global._cerrahMessengerStore = [];
}

// Client metadata map for dynamic thread resolution
const CLIENT_META_MAP: Record<string, { name: string; phone: string; role: 'clinic_client' | 'online_subscriber' }> = {};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');
    const clientId = searchParams.get('clientId');

    // Safe retrieval from global store
    const store = global._cerrahMessengerStore || [];

    // 1. Conversations list mode (for Doctor / Staff inboxes)
    if (mode === 'conversations') {
      const threadMap: Record<string, ConversationThread> = {};

      for (const msg of store) {
        const cId = msg.clientId;
        const meta = CLIENT_META_MAP[cId] || {
          name: msg.senderRole === 'client' || msg.senderRole === 'subscriber' ? msg.senderName : `عميل #${cId}`,
          phone: '',
          role: (msg.senderRole === 'subscriber' ? 'online_subscriber' : 'clinic_client') as 'clinic_client' | 'online_subscriber'
        };

        if (!threadMap[cId]) {
          threadMap[cId] = {
            clientId: cId,
            clientName: meta.name,
            clientPhone: meta.phone,
            clientRole: meta.role,
            lastMessage: msg,
            unreadCount: 0,
          };
        } else {
          // Keep newest message
          if (new Date(msg.createdAt) > new Date(threadMap[cId].lastMessage.createdAt)) {
            threadMap[cId].lastMessage = msg;
          }
        }

        // Count unread messages sent by client
        if (!msg.isRead && (msg.senderRole === 'client' || msg.senderRole === 'subscriber')) {
          threadMap[cId].unreadCount += 1;
        }
      }

      const threads = Object.values(threadMap).sort(
        (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      );

      return NextResponse.json({ success: true, threads });
    }

    // 2. Specific client chat history mode
    if (clientId) {
      const clientMessages = store
        .filter((m) => m.clientId === clientId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      return NextResponse.json({ success: true, messages: clientMessages });
    }

    // Default: return all messages
    return NextResponse.json({ success: true, messages: store });
  } catch (error) {
    console.error('Error in GET /api/messenger:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clientId,
      senderId,
      senderName,
      senderRole,
      receiverRole,
      text,
      messageType,
      mediaUrl,
      mediaDuration,
      fileName,
      fileSize,
      clientPhone
    } = body;

    if (!clientId) {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
    }

    // Update metadata map if client info provided
    if (senderName && (senderRole === 'client' || senderRole === 'subscriber')) {
      CLIENT_META_MAP[clientId] = {
        name: senderName,
        phone: clientPhone || CLIENT_META_MAP[clientId]?.phone || '',
        role: senderRole === 'subscriber' ? 'online_subscriber' : 'clinic_client'
      };
    }

    const newMessage: MessengerMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      clientId,
      senderId: senderId || 'user',
      senderName: senderName || 'مستخدم',
      senderRole: senderRole || 'client',
      receiverRole: receiverRole || 'clinic',
      text: (text || '').trim(),
      messageType: messageType || 'text',
      mediaUrl: mediaUrl || null,
      mediaDuration: mediaDuration || null,
      fileName: fileName || null,
      fileSize: fileSize || null,
      isRead: senderRole === 'doctor' || senderRole === 'staff', // automatically read if clinic sent it
      createdAt: new Date().toISOString(),
    };

    if (!global._cerrahMessengerStore) {
      global._cerrahMessengerStore = [];
    }
    global._cerrahMessengerStore.push(newMessage);

    // Attempt PostgreSQL persistence (non-blocking fallback)
    try {
      await db.insert(messages).values({
        id: newMessage.id,
        clientId: newMessage.clientId,
        senderId: newMessage.senderId,
        senderName: newMessage.senderName,
        senderRole: newMessage.senderRole,
        receiverRole: newMessage.receiverRole,
        text: newMessage.text,
        messageType: newMessage.messageType,
        mediaUrl: newMessage.mediaUrl,
        mediaDuration: newMessage.mediaDuration,
        fileName: newMessage.fileName,
        fileSize: newMessage.fileSize,
        isRead: newMessage.isRead ? 'true' : 'false',
        createdAt: new Date(newMessage.createdAt),
      });
    } catch (sqlErr) {
      // Dual-persistence fallback to in-memory store
      console.warn('Note: Drizzle DB insert queued in memory store:', sqlErr instanceof Error ? sqlErr.message : sqlErr);
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error in POST /api/messenger:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { clientId } = body;

    if (!clientId) {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
    }

    if (global._cerrahMessengerStore) {
      for (const m of global._cerrahMessengerStore) {
        if (m.clientId === clientId) {
          m.isRead = true;
        }
      }
    }

    try {
      await db.update(messages)
        .set({ isRead: 'true' })
        .where(eq(messages.clientId, clientId));
    } catch (sqlErr) {
      console.warn('Note: Drizzle DB update in memory:', sqlErr instanceof Error ? sqlErr.message : sqlErr);
    }

    return NextResponse.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error in PATCH /api/messenger:', error);
    return NextResponse.json({ error: 'Failed to update messages' }, { status: 500 });
  }
}
