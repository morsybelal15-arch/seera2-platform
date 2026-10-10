import { NextResponse } from 'next/server';

export type ComplaintItem = {
  id: string;
  ticketNumber: string;
  name: string;
  phone: string;
  category: 'متاح شات؟' | 'تعديل خطة' | 'إعادة تقييم' | 'شكوى عامة أو موعد';
  details: string;
  photoUrl?: string;
  status: 'new' | 'in_progress' | 'resolved';
  doctorNotes?: string;
  createdAt: string;
};

declare global {
  var _cerrahComplaintsStore: ComplaintItem[] | undefined;
}

if (!global._cerrahComplaintsStore) {
  global._cerrahComplaintsStore = [];
}

export async function GET() {
  try {
    return NextResponse.json(global._cerrahComplaintsStore || []);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, category, details, photoUrl } = body;

    if (!name || !phone || !details) {
      return NextResponse.json({ error: 'Name, phone, and details are required' }, { status: 400 });
    }

    const ticketNumber = `CRH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newItem: ComplaintItem = {
      id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ticketNumber,
      name: name.trim(),
      phone: phone.trim(),
      category: category || 'متاح شات؟',
      details: details.trim(),
      photoUrl: photoUrl || undefined,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    if (!global._cerrahComplaintsStore) {
      global._cerrahComplaintsStore = [];
    }
    global._cerrahComplaintsStore.unshift(newItem);

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error saving complaint:', error);
    return NextResponse.json({ error: 'Failed to process complaint' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, doctorNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    if (global._cerrahComplaintsStore) {
      const idx = global._cerrahComplaintsStore.findIndex((c) => c.id === id);
      if (idx !== -1) {
        global._cerrahComplaintsStore[idx].status = status;
        if (doctorNotes !== undefined) {
          global._cerrahComplaintsStore[idx].doctorNotes = doctorNotes;
        }
        return NextResponse.json({ success: true, item: global._cerrahComplaintsStore[idx] });
      }
    }

    return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json({ error: 'Failed to update complaint' }, { status: 500 });
  }
}
