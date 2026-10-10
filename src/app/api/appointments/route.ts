import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { appointments } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let result;
    if (userId) {
      result = await db
        .select()
        .from(appointments)
        .where(eq(appointments.userId, userId))
        .orderBy(desc(appointments.createdAt));
    } else {
      result = await db
        .select()
        .from(appointments)
        .orderBy(desc(appointments.createdAt));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      patientName,
      phone,
      email,
      service,
      preferredDate,
      preferredTime,
      notes,
      userId,
    } = body;

    const [created] = await db
      .insert(appointments)
      .values({
        id: id || `apt_${Date.now()}`,
        patientName: patientName || '',
        phone: phone || '',
        email: email || null,
        service: service || 'استشارة عامة',
        preferredDate: preferredDate || new Date().toISOString().split('T')[0],
        preferredTime: preferredTime || '17:00',
        status: 'pending',
        notes: notes || null,
        userId: userId || null,
      })
      .returning();

    return NextResponse.json(created);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
