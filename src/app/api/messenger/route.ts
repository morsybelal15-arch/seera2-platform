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
  clientRole: 'online_subscriber';
  lastMessage: MessengerMessage;
  unreadCount: number;
}

declare global {
  var _seeraMessengerStore: MessengerMessage[] | undefined;
  var _seeraClientMetaMap: Record<string, { name: string; phone: string; role: 'online_subscriber' }> | undefined;
}

// Default initial real conversations for online subscribers
const INITIAL_CONVERSATIONS: MessengerMessage[] = [
  {
    id: 'msg_init_1',
    clientId: 'sub_sara_1',
    senderId: 'sub_sara_1',
    senderName: 'سارة أحمد',
    senderRole: 'subscriber',
    receiverRole: 'clinic',
    text: 'مساء الخير يا دكتور، قست وزني اليوم بالميزان الصباحي ونزلت 1.8 كجم هذا الأسبوع، ومقاس الخصر قل 2 سم مع الالتزام التام بالصيام المتقطع!',
    messageType: 'text',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'msg_init_2',
    clientId: 'sub_sara_1',
    senderId: 'usr_doc_1',
    senderName: 'د. بلال مرسي',
    senderRole: 'doctor',
    receiverRole: 'client',
    text: 'أهلاً بكِ يا سارة، ما شاء الله نزول ممتاز واستجابة رائعة لمنطقة البطن! استمري على نفس جدول السعرات وشرب 3.5 لتر ماء يومياً.',
    messageType: 'text',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'msg_init_3',
    clientId: 'sub_sara_1',
    senderId: 'sub_sara_1',
    senderName: 'سارة أحمد',
    senderRole: 'subscriber',
    receiverRole: 'clinic',
    text: 'تمام دكتور، هل أستمر بنفس مواعيد الرياضة الحالية؟',
    messageType: 'text',
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'msg_init_4',
    clientId: 'sub_mahmoud_2',
    senderId: 'sub_mahmoud_2',
    senderName: 'م. محمود علي',
    senderRole: 'subscriber',
    receiverRole: 'clinic',
    text: 'السلام عليكم دكتور، أرفقت لحضرتك صورة نتائج تحاليل الغدة والـ BMR للاطلاع عليها قبل تجديد جدول الأسبوع القادم.',
    messageType: 'text',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'msg_init_5',
    clientId: 'sub_mahmoud_2',
    senderId: 'usr_doc_1',
    senderName: 'د. بلال مرسي',
    senderRole: 'doctor',
    receiverRole: 'client',
    text: 'وعليكم السلام يا باشمهندس محمود، راجعت التحاليل ومعدل الحرق BMR في تطور إيجابي ملحوظ. سأقوم بتحديث خطة البروتين في ملفك اليوم.',
    messageType: 'text',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'msg_init_6',
    clientId: 'sub_maryam_3',
    senderId: 'sub_maryam_3',
    senderName: 'مريم خالد',
    senderRole: 'subscriber',
    receiverRole: 'clinic',
    text: 'دكتور، هل يمكن استبدال وجبة السناك ببذور الشيا مع الزبادي اليوناني في يوم الصيام؟',
    messageType: 'text',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'msg_init_7',
    clientId: 'sub_maryam_3',
    senderId: 'usr_doc_1',
    senderName: 'د. بلال مرسي',
    senderRole: 'doctor',
    receiverRole: 'client',
    text: 'نعم بالتأكيد يا مريم، خيار ممتاز وخفيف ويدعم محاربة احتباس السوائل تحت الجلد.',
    messageType: 'text',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
];

// Initialize global store
if (!global._seeraMessengerStore) {
  global._seeraMessengerStore = [...INITIAL_CONVERSATIONS];
}

// Client metadata map
if (!global._seeraClientMetaMap) {
  global._seeraClientMetaMap = {
    'sub_sara_1': { name: 'سارة أحمد', phone: '01012345678', role: 'online_subscriber' },
    'sub_mahmoud_2': { name: 'م. محمود علي', phone: '01123456789', role: 'online_subscriber' },
    'sub_maryam_3': { name: 'مريم خالد', phone: '01234567890', role: 'online_subscriber' },
    'sub_ahmed_1': { name: 'أحمد فؤاد', phone: '01512345678', role: 'online_subscriber' },
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');
    const clientId = searchParams.get('clientId');

    // Retrieve from store
    let store = global._seeraMessengerStore || [];

    // Attempt PostgreSQL DB hydration if available
    try {
      if (process.env.SQL_HOST) {
        const dbMsgs = await db.select().from(messages).orderBy(asc(messages.createdAt));
        if (dbMsgs && dbMsgs.length > 0) {
          const mappedDbMsgs: MessengerMessage[] = dbMsgs.map(m => ({
            id: m.id,
            clientId: m.clientId,
            senderId: m.senderId,
            senderName: m.senderName,
            senderRole: m.senderRole as any,
            receiverRole: (m.receiverRole || 'clinic') as any,
            text: m.text,
            messageType: (m.messageType || 'text') as any,
            mediaUrl: m.mediaUrl,
            mediaDuration: m.mediaDuration,
            fileName: m.fileName,
            fileSize: m.fileSize,
            isRead: m.isRead === 'true',
            createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
          }));
          // Merge with in-memory store without duplicates
          const existingIds = new Set(store.map(s => s.id));
          for (const dm of mappedDbMsgs) {
            if (!existingIds.has(dm.id)) {
              store.push(dm);
            }
          }
        }
      }
    } catch (sqlErr) {
      // Non-blocking fallback to in-memory store
    }

    // 1. Conversations list mode (for Doctor / Staff inboxes)
    if (mode === 'conversations') {
      const threadMap: Record<string, ConversationThread> = {};

      // Seed threads from metadata map first so all subscribers appear
      const metaMap = global._seeraClientMetaMap || {};
      for (const [cId, meta] of Object.entries(metaMap)) {
        threadMap[cId] = {
          clientId: cId,
          clientName: meta.name,
          clientPhone: meta.phone,
          clientRole: 'online_subscriber',
          lastMessage: {
            id: `init_${cId}`,
            clientId: cId,
            senderId: cId,
            senderName: meta.name,
            senderRole: 'subscriber',
            receiverRole: 'clinic',
            text: 'جاهز لبدء استشارة المتابعة الأونلاين...',
            messageType: 'text',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
          unreadCount: 0,
        };
      }

      // Populate latest message and unread count from actual messages
      for (const msg of store) {
        const cId = msg.clientId;
        const meta = metaMap[cId] || {
          name: msg.senderRole === 'client' || msg.senderRole === 'subscriber' ? msg.senderName : `مشترك #${cId}`,
          phone: '',
          role: 'online_subscriber' as const,
        };

        if (!threadMap[cId]) {
          threadMap[cId] = {
            clientId: cId,
            clientName: meta.name,
            clientPhone: meta.phone,
            clientRole: 'online_subscriber',
            lastMessage: msg,
            unreadCount: 0,
          };
        } else {
          // Keep newest message
          if (new Date(msg.createdAt) >= new Date(threadMap[cId].lastMessage.createdAt)) {
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
      if (!global._seeraClientMetaMap) global._seeraClientMetaMap = {};
      global._seeraClientMetaMap[clientId] = {
        name: senderName,
        phone: clientPhone || global._seeraClientMetaMap[clientId]?.phone || '',
        role: 'online_subscriber'
      };
    }

    const newMessage: MessengerMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      clientId,
      senderId: senderId || 'user',
      senderName: senderName || 'مستخدم',
      senderRole: senderRole || 'subscriber',
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

    if (!global._seeraMessengerStore) {
      global._seeraMessengerStore = [];
    }
    global._seeraMessengerStore.push(newMessage);

    // Attempt PostgreSQL persistence (non-blocking fallback)
    try {
      if (process.env.SQL_HOST) {
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
      }
    } catch (sqlErr) {
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

    if (global._seeraMessengerStore) {
      for (const m of global._seeraMessengerStore) {
        if (m.clientId === clientId) {
          m.isRead = true;
        }
      }
    }

    try {
      if (process.env.SQL_HOST) {
        await db.update(messages)
          .set({ isRead: 'true' })
          .where(eq(messages.clientId, clientId));
      }
    } catch (sqlErr) {
      console.warn('Note: Drizzle DB update in memory:', sqlErr instanceof Error ? sqlErr.message : sqlErr);
    }

    return NextResponse.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error in PATCH /api/messenger:', error);
    return NextResponse.json({ error: 'Failed to update messages' }, { status: 500 });
  }
}
