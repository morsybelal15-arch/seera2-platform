import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { patients } from '@/db/schema';
import { desc } from 'drizzle-orm';

const INITIAL_PATIENTS: any[] = [];

export async function GET() {
  try {
    const list = await db.select().from(patients).orderBy(desc(patients.createdAt));
    return NextResponse.json(list || []);
  } catch (error) {
    console.error('Error fetching patients from PostgreSQL:', error);
    // Return empty array so UI initializes cleanly without mock data
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, phone, qrCodeUrl, diet, sessions, avatarProps, userId } = body;

    const [saved] = await db
      .insert(patients)
      .values({
        id,
        name,
        phone,
        qrCodeUrl: qrCodeUrl || `https://cerrah.com/p/${id}`,
        diet: diet || null,
        sessions: sessions || [],
        avatarProps: avatarProps || {},
        userId: userId || null,
      })
      .onConflictDoUpdate({
        target: patients.id,
        set: {
          name,
          phone,
          qrCodeUrl: qrCodeUrl || `https://cerrah.com/p/${id}`,
          diet: diet || null,
          sessions: sessions || [],
          avatarProps: avatarProps || {},
          userId: userId || null,
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json(saved);
  } catch (error) {
    console.error('Error saving patient to PostgreSQL:', error);
    return NextResponse.json({ error: 'Failed to save patient' }, { status: 500 });
  }
}
