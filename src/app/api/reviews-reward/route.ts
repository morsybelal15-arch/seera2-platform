import { NextResponse } from 'next/server';

export type ReviewRewardItem = {
  id: string;
  name: string;
  phone: string;
  rating: number;
  reviewText: string;
  photoUrl?: string;
  rewardAmount: number;
  status: 'pending' | 'approved' | 'credited';
  createdAt: string;
};

// Global in-memory persistence store for reliable fallback and live synchronization
declare global {
  var _cerrahReviewsStore: ReviewRewardItem[] | undefined;
}

if (!global._cerrahReviewsStore) {
  global._cerrahReviewsStore = [];
}

export async function GET() {
  try {
    return NextResponse.json(global._cerrahReviewsStore || []);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, rating, reviewText, photoUrl, rewardAmount } = body;

    if (!name || !phone || !reviewText) {
      return NextResponse.json({ error: 'Name, phone and reviewText are required' }, { status: 400 });
    }

    const newItem: ReviewRewardItem = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      phone: phone.trim(),
      rating: Number(rating) || 5,
      reviewText: reviewText.trim(),
      photoUrl: photoUrl || undefined,
      rewardAmount: Number(rewardAmount) || 150, // 150 EGP credit voucher reward
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (!global._cerrahReviewsStore) {
      global._cerrahReviewsStore = [];
    }
    global._cerrahReviewsStore.unshift(newItem);

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error saving review reward submission:', error);
    return NextResponse.json({ error: 'Failed to process review' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    if (global._cerrahReviewsStore) {
      const idx = global._cerrahReviewsStore.findIndex((r) => r.id === id);
      if (idx !== -1) {
        global._cerrahReviewsStore[idx].status = status;
        return NextResponse.json({ success: true, item: global._cerrahReviewsStore[idx] });
      }
    }

    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating review status:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
