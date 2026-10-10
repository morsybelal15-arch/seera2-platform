import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { users } from '@/db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, email, displayName, role } = body;

    if (!uid || !email) {
      return NextResponse.json({ error: 'UID and email are required' }, { status: 400 });
    }

    const [user] = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        role: role || 'patient',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
          role: role || 'patient',
        },
      })
      .returning();

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error syncing user profile:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
