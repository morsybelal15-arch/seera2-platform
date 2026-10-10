import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { contactMessages } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, fullName, phone, email, inquiryType, message } = body;

    const [saved] = await db
      .insert(contactMessages)
      .values({
        id: id || `msg_${Date.now()}`,
        fullName: fullName || '',
        phone: phone || '',
        email: email || null,
        inquiryType: inquiryType || 'booking',
        message: message || '',
      })
      .returning();

    return NextResponse.json(saved);
  } catch (error) {
    console.error('Error saving contact message to PostgreSQL:', error);
    return NextResponse.json({ error: 'Failed to submit contact message' }, { status: 500 });
  }
}
