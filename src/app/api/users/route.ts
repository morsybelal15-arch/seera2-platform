import { NextResponse } from 'next/server';

export type UserRole = 
  | 'guest'              // زائر عام
  | 'visitor'            // زائر مسجل (بانتظار التفعيل)
  | 'doctor'             // دكتور
  | 'staff'              // طاقم من المركز
  | 'online_subscriber'  // مشترك أونلاين
  | 'clinic_client';     // عميل من المركز

export type SystemUser = {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: UserRole;
  roles?: UserRole[];
  status: 'active' | 'pending' | 'suspended';
  notes?: string;
  lastLogin?: string;
  createdAt: string;
};

declare global {
  var _cerrahUsersStore: SystemUser[] | undefined;
}

if (!global._cerrahUsersStore) {
  global._cerrahUsersStore = [
    {
      id: 'usr_doc_1',
      uid: 'uid_belal_doctor',
      email: 'morsybelal15@gmail.com',
      displayName: 'د. بلال مرسي',
      phone: '01108080564',
      role: 'doctor',
      status: 'active',
      notes: 'المدير الطبي واستشاري التغذية العلاجية وعلاج السمنة',
      lastLogin: new Date().toISOString(),
      createdAt: '2026-08-01T10:00:00Z',
    },
  ];
}

export async function GET() {
  try {
    return NextResponse.json(global._cerrahUsersStore || []);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, email, displayName, phone, role, roles, notes, status } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!global._cerrahUsersStore) {
      global._cerrahUsersStore = [];
    }

    const cleanEmail = email.trim().toLowerCase();
    const isMasterDoctor = cleanEmail === 'morsybelal15@gmail.com';

    // Security: Only the master doctor can have the 'doctor' role upon self-registration.
    // Self-registrations cannot claim 'doctor' or 'staff' privilege arbitrarily.
    let sanitizedRole: UserRole = isMasterDoctor ? 'doctor' : 'visitor';
    if (!isMasterDoctor && role) {
      if (role === 'doctor' || role === 'staff') {
        sanitizedRole = 'visitor'; // Deny elevation
      } else {
        sanitizedRole = role as UserRole;
      }
    }

    // Check if user already exists
    const existingIndex = global._cerrahUsersStore.findIndex(
      (u) => (uid && u.uid === uid) || u.email.toLowerCase() === cleanEmail || (phone && u.phone && u.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''))
    );

    if (existingIndex !== -1) {
      const existing = global._cerrahUsersStore[existingIndex];
      // Keep existing role if not master doctor and attempting privilege escalation
      const targetRole = isMasterDoctor 
        ? 'doctor' 
        : (role === 'doctor' || role === 'staff') 
          ? existing.role 
          : (role || existing.role);

      const updatedUser: SystemUser = {
        ...existing,
        displayName: displayName || existing.displayName,
        phone: phone || existing.phone,
        role: targetRole,
        roles: roles !== undefined ? roles : existing.roles,
        status: status || existing.status,
        notes: notes !== undefined ? notes : existing.notes,
        lastLogin: new Date().toISOString(),
      };
      global._cerrahUsersStore[existingIndex] = updatedUser;
      return NextResponse.json({ success: true, user: updatedUser });
    }

    const newUser: SystemUser = {
      id: `usr_${Date.now()}`,
      uid: uid || `uid_${Date.now()}`,
      email: cleanEmail,
      displayName: displayName || cleanEmail.split('@')[0],
      phone: phone || '',
      role: sanitizedRole,
      roles: roles || [sanitizedRole],
      status: status || (isMasterDoctor ? 'active' : (sanitizedRole === 'clinic_client' || sanitizedRole === 'online_subscriber' ? 'active' : 'pending')),
      notes: notes || 'مستخدم مسجل جديد عبر الموقع',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    global._cerrahUsersStore.unshift(newUser);
    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Error saving user profile:', error);
    return NextResponse.json({ error: 'Failed to save user' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, uid, role, roles, displayName, phone, notes, status } = body;

    if (!id && !uid) {
      return NextResponse.json({ error: 'User id or uid is required' }, { status: 400 });
    }

    if (!global._cerrahUsersStore) return NextResponse.json({ error: 'No users' }, { status: 404 });

    const idx = global._cerrahUsersStore.findIndex(
      (u) => (id && u.id === id) || (uid && u.uid === uid)
    );

    if (idx === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const current = global._cerrahUsersStore[idx];
    const updated: SystemUser = {
      ...current,
      role: role || current.role,
      roles: roles !== undefined ? roles : current.roles,
      displayName: displayName !== undefined ? displayName : current.displayName,
      phone: phone !== undefined ? phone : current.phone,
      notes: notes !== undefined ? notes : current.notes,
      status: status || current.status,
    };

    global._cerrahUsersStore[idx] = updated;
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (global._cerrahUsersStore) {
      global._cerrahUsersStore = global._cerrahUsersStore.filter((u) => u.id !== id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
