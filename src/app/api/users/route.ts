import { NextResponse } from 'next/server';
import { UserRole } from '@/lib/permissions';

export type { UserRole };

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

const SEED_USERS: SystemUser[] = [
    {
      id: 'usr_doc_1',
      uid: 'uid_belal_doctor',
      email: 'morsybelal15@gmail.com',
      displayName: 'د. بلال مرسي',
      phone: '01108080564',
      role: 'doctor',
      roles: ['doctor'],
      status: 'active',
      notes: 'المدير الطبي واستشاري التغذية العلاجية وعلاج السمنة',
      lastLogin: new Date().toISOString(),
      createdAt: '2026-08-01T10:00:00Z',
    },
    {
      id: 'usr_staff_1',
      uid: 'uid_staff_admin',
      email: 'staff@seera2.clinic',
      displayName: 'مساعد العيادة وفريق المتابعة',
      phone: '01099887766',
      role: 'staff',
      roles: ['staff'],
      status: 'active',
      notes: 'منسق المتابعات والملفات الطبية والمشتركين',
      lastLogin: new Date().toISOString(),
      createdAt: '2026-09-01T10:00:00Z',
    },
    {
      id: 'sub_sara_1',
      uid: 'sub_sara_1',
      email: 'sara.ahmed@gmail.com',
      displayName: 'سارة أحمد',
      phone: '01012345678',
      role: 'online_subscriber',
      roles: ['online_subscriber'],
      status: 'active',
      notes: 'مشتركة باقة نحت القوام 3D والمتابعة الأسبوعية - نزول 1.8 كجم',
      lastLogin: new Date().toISOString(),
      createdAt: '2026-09-15T12:00:00Z',
    },
    {
      id: 'sub_mahmoud_2',
      uid: 'sub_mahmoud_2',
      email: 'eng.mahmoud@gmail.com',
      displayName: 'م. محمود علي',
      phone: '01123456789',
      role: 'online_subscriber',
      roles: ['online_subscriber'],
      status: 'active',
      notes: 'مشترك نظام الكيتو العلاجي ورفع معدل الحرق BMR',
      lastLogin: new Date().toISOString(),
      createdAt: '2026-09-20T14:30:00Z',
    },
    {
      id: 'sub_maryam_3',
      uid: 'sub_maryam_3',
      email: 'maryam.khalid@gmail.com',
      displayName: 'مريم خالد',
      phone: '01234567890',
      role: 'online_subscriber',
      roles: ['online_subscriber'],
      status: 'pending',
      notes: 'بانتظار تجديد الاشتراك الأسبوعي وتأكيد تحويل الرسوم',
      lastLogin: new Date().toISOString(),
      createdAt: '2026-10-01T09:00:00Z',
    },
    {
      id: 'sub_ahmed_1',
      uid: 'sub_ahmed_1',
      email: 'ahmed.fouad@gmail.com',
      displayName: 'أحمد فؤاد',
      phone: '01512345678',
      role: 'visitor',
      roles: ['visitor'],
      status: 'suspended',
      notes: 'حساب زائر مجمد لعدم استكمال الفحوصات والتحاليل المطلوبة',
      lastLogin: new Date().toISOString(),
      createdAt: '2026-10-05T11:00:00Z',
    },
  ];

if (!global._cerrahUsersStore || global._cerrahUsersStore.length < 2) {
  global._cerrahUsersStore = [...SEED_USERS];
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
      status: status || (isMasterDoctor ? 'active' : (sanitizedRole === 'online_subscriber' ? 'active' : 'pending')),
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

export const PUT = PATCH;


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
