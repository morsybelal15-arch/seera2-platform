"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { UserRole } from '@/lib/permissions';
import { SystemUser } from '@/app/api/users/route';

export type Session = { 
  id: string; 
  date: string; 
  device: string; 
  duration: number; 
  status: 'completed' | 'upcoming'; 
  powerJoules?: number;
  pulseCount?: number;
  targetArea?: string;
  operatorName?: string;
  clinicalNotes?: string;
};

export type Diet = { 
  id: string; 
  name: string; 
  instructions: string;
  templateId?: string;
  assignedAt?: string;
  doctorNotes?: string;
  waterTargetLiters?: number;
  dailyMeals?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
};

export type AdherenceLog = {
  date: string;
  followedDiet: boolean;
  waterLiters: number;
  avoidedSugar: boolean;
  workoutDone: boolean;
  notes?: string;
};

export type Patient = {
  id: string;
  name: string;
  phone: string;
  qrCodeUrl: string;
  qrToken?: string;
  diet: Diet | null;
  sessions: Session[];
  avatarProps: Record<string, any>;
  userId?: string;
  adherenceLogs?: AdherenceLog[];
  weightHistory?: { date: string; weight: number; bmi: number }[];
  registeredBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DietTemplate = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  type: 'loss' | 'gain' | 'maintenance' | 'rehab';
  targetCalories?: number;
  waterTarget?: number;
  dailyMeals?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
  postSessionGuidelines?: string;
  isPrintable?: boolean;
  createdAt?: string;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName?: string;
  phone?: string;
  role: UserRole;
  roles?: UserRole[];
  status?: 'active' | 'pending' | 'suspended';
  patientId?: string;
  createdAt?: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  phone: string;
  email?: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  userId?: string;
  createdAt?: string;
};

export type ChatMessage = {
  id: string;
  patientId: string;
  senderRole: UserRole | 'patient';
  senderName: string;
  text: string;
  timestamp: string;
  isRead?: boolean;
  type?: 'text' | 'diet_assigned' | 'prescription' | 'session_logged';
  meta?: Record<string, any>;
};

type ClinicContextType = {
  patients: Patient[];
  dietTemplates: DietTemplate[];
  appointments: Appointment[];
  systemUsers: SystemUser[];
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  isAuthLoading: boolean;
  chatMessages: ChatMessage[];
  // Patient & Onboarding Actions
  addPatient: (patient: Patient) => Promise<void>;
  updatePatient: (id: string, updatedData: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  registerNewClient: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    gender?: 'male' | 'female';
    weight?: number;
    height?: number;
    dietTemplateId?: string;
    doctorNotes?: string;
    role?: 'clinic_client' | 'online_subscriber';
  }) => Promise<{ patient: Patient; qrToken: string }>;
  // Fast Login with Credentials or QR
  loginWithCredentials: (name: string, phone: string) => Promise<{ success: boolean; error?: string; patient?: Patient }>;
  loginWithQrToken: (qrTokenOrUrl: string) => Promise<{ success: boolean; error?: string; patient?: Patient }>;
  registerVisitor: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  }) => Promise<{ success: boolean; error?: string; user?: SystemUser }>;
  // Templates & Prescriptions Actions
  addDietTemplate: (template: DietTemplate) => Promise<void>;
  updateDietTemplate: (id: string, template: Partial<DietTemplate>) => Promise<void>;
  deleteDietTemplate: (id: string) => Promise<void>;
  assignDietToPatient: (patientId: string, template: DietTemplate, customNotes?: string) => Promise<void>;
  // Sessions Management
  logSession: (patientId: string, session: Session) => Promise<void>;
  // Appointments & Users
  addAppointment: (appointment: Partial<Appointment>) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  updateSystemUser: (id: string, updates: Partial<SystemUser>) => Promise<void>;
  addSystemUser: (user: Partial<SystemUser>) => Promise<void>;
  deleteSystemUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
  // Chat & Communication
  sendChatMessage: (patientId: string, text: string, senderRole?: UserRole, senderName?: string) => Promise<void>;
  fetchChatMessages: (patientId?: string) => Promise<void>;
  // Others
  saveSimulation: (simulation: any) => Promise<any>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const DEFAULT_PATIENTS: Patient[] = [];

const DEFAULT_TEMPLATES: DietTemplate[] = [
  {
    id: '1',
    name: 'دايت كيتو متقدم لتفتيت الدهون (Keto Protocol)',
    description: 'نظام كيتوني منخفض الكربوهيدرات لرفع معدل الحرق والتزامن مع أجهزة Onda و Scizer.',
    instructions: '- الالتزام بنسبة 70% دهون صحية، 25% بروتين، 5% كربوهيدرات.\n- شرب ما لا يقل عن 3.5 لتر ماء يومياً.\n- مكملات الإلكتروليتات والمغنيسيوم عند اللزوم.',
    type: 'loss',
    targetCalories: 1600,
    waterTarget: 3.5,
    dailyMeals: {
      breakfast: '3 بيضات مقلية بالزبدة الطبيعية + شرائح أفوكادو + طبق جرجير وزيت زيتون',
      lunch: 'شريحة ستيك بقري 200 جم أو سلمون مشوي + بروكلي سوتيه بملعقة زبدة',
      dinner: 'سلطة سيزر بالدجاج مع صوص زيت الزيتون والليمون والجبن البارميزان',
      snacks: 'مكسرات عين جمل أو لوز ني (30 جم) + شاي ماتشا بدون سكر'
    },
    postSessionGuidelines: 'شرب 500 مل ماء فوراً بعد الجلسة والمشي الخفيف لمدة 20 دقيقة لتنشيط التصريف اللمفاوي.'
  },
  {
    id: '2',
    name: 'صيام متقطع (16/8) مع بروتين عالي لنحت القوام',
    description: 'نافذة تناول الطعام 8 ساعات وصيام 16 ساعة مع التركيز على بناء الكتلة العضلية وخسارة المقاسات.',
    instructions: '- الصيام من الساعة 8 مساءً حتى 12 ظهراً.\n- تجنب السكريات المكررة والمشروبات الغازية تماماً.\n- تقسيم السعرات على وجبتين رئيسيتين وسناك بروتيني.',
    type: 'loss',
    targetCalories: 1500,
    waterTarget: 3.0,
    dailyMeals: {
      breakfast: 'فترة صيام: ماء + شاي أخضر بدون سكر + قهوة أمريكانو سادة',
      lunch: '250 جم صدور دجاج مشوية + 6 ملاعق أرز بني أو كينوا + سلطة خضراء غنية بالليمون',
      dinner: '200 جم جبن قريش مخلوط بزيت زيتون وزعتر + 2 خيار + نصف رغيف بلدي أسمر',
      snacks: 'سكوب بروتين مع حليب لوز أو كوب زبادي يوناني مع بذور الشيا'
    },
    postSessionGuidelines: 'الامتناع عن الأطعمة الدسمة لمدة 24 ساعة بعد جلسة Onda لتسهيل تخلص الكبد من الدهون المفتتة.'
  },
  {
    id: '3',
    name: 'نظام تصريف السوائل ومحاربة السيلوليت (Anti-Water Retention)',
    description: 'نظام قليل الصوديوم وغني بالبوتاسيوم ومضادات الأكسدة لشد الجلد وتقليل احتباس السوائل.',
    instructions: '- الامتناع عن الملح الزائد والمخللات والأطعمة المصنعة.\n- التركيز على الخضروات الورقية والخيار والأناناس والشاي الأخضر.\n- شرب مغلي البقدونس أو الكرفس صباحاً.',
    type: 'rehab',
    targetCalories: 1400,
    waterTarget: 4.0,
    dailyMeals: {
      breakfast: 'كوب شوفان مطبوخ بالماء مع حليب خالي الدسم + شرائح توت أو كيوي + ملعقة بذور كتان',
      lunch: 'سمك فيليه مشوي بالأعشاب والليمون + بطاطس بيوريه صغيرة بدون زبدة + سلطة جرجير',
      dinner: 'شوربة خضار مشكلة خالية من الصوديوم + قطعة جبن قريش صغيرة + شريحة توست بني',
      snacks: 'شريحتان أناناس طازج + كوب شاي أخضر بالنعناع'
    },
    postSessionGuidelines: 'جلسة تدليك يدوي خفيف أو تصريف هوائي لتسريع التخلص من السوائل تحت الجلد.'
  },
  {
    id: '4',
    name: 'نظام تثبيت الوزن وتوازن الأيض (Metabolic Maintenance)',
    description: 'خطة غذائية متوازنة بعد تحقيق الهدف والحفاظ على مقاسات الجسم بدون حرمان.',
    instructions: '- تناول وجبات متوازنة من كافة العناصر الغذائية بمعدل 2000 سعرة.\n- ممارسة الرياضة 3 مرات أسبوعياً.\n- المتابعة الدورية للوزن كل أسبوعين.',
    type: 'maintenance',
    targetCalories: 2000,
    waterTarget: 3.0,
    dailyMeals: {
      breakfast: '2 بيضة مسلوقة + رغيف خبز بلدي + قطعة جبن أبيض قليل الدسم + خضار طازج',
      lunch: 'وجبة متكاملة (بروتين 200 جم + خضار مطبوخ + 6-8 ملاعق نشويات معقدة + سلطة)',
      dinner: 'علبة زبادي لايت مع تفاحة أو ثمرة موز + ملعقة شوفان',
      snacks: 'فواكه موسمية طازجة أو حفنة مكسرات مشكلة'
    },
    postSessionGuidelines: 'جلسة صيانة سنوية أو نصف سنوية للمحافظة على شد الأنسجة.'
  }
];

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(DEFAULT_PATIENTS);
  const [dietTemplates, setDietTemplates] = useState<DietTemplate[]>(DEFAULT_TEMPLATES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>('guest');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // 1. Initial Data Fetch
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [resPatients, resTemplates, resAppointments, resUsers, resChat] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/diet-templates'),
          fetch('/api/appointments'),
          fetch('/api/users'),
          fetch('/api/chat'),
        ]);

        if (resPatients.ok) {
          const pData = await resPatients.json();
          if (Array.isArray(pData)) setPatients(pData);
        }

        if (resTemplates.ok) {
          const tData = await resTemplates.json();
          if (Array.isArray(tData) && tData.length > 0) setDietTemplates(tData);
        }

        if (resAppointments.ok) {
          const aData = await resAppointments.json();
          if (Array.isArray(aData)) setAppointments(aData);
        }

        if (resUsers.ok) {
          const uData = await resUsers.json();
          if (Array.isArray(uData) && uData.length > 0) {
            setSystemUsers(uData);
          }
        }

        if (resChat.ok) {
          const cData = await resChat.json();
          if (Array.isArray(cData)) setChatMessages(cData);
        }
      } catch (err) {
        console.warn('Initial data fetch fallback:', err);
      }
    }

    loadInitialData();
  }, []);

  // 2. Auth State Listener
  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setIsAuthLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        setIsAuthLoading(false);

        if (user) {
          const isDocEmail = user.email === 'morsybelal15@gmail.com';
          const existingSysUser = systemUsers.find(
            u => u.uid === user.uid || (user.email && u.email.toLowerCase() === user.email.toLowerCase())
          );
          const defaultRole: UserRole = isDocEmail 
            ? 'doctor' 
            : (existingSysUser?.role || 'visitor');

          const profileData: UserProfile = {
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || existingSysUser?.displayName || (isDocEmail ? 'د. بلال مرسي' : 'زائر مسجل'),
            role: defaultRole,
            roles: existingSysUser?.roles || [defaultRole],
            status: isDocEmail ? 'active' : (existingSysUser?.status || 'pending'),
            createdAt: new Date().toISOString()
          };
          setUserProfile(profileData);
          setActiveRole(defaultRole);

          try {
            const syncRes = await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || profileData.displayName,
                role: defaultRole,
                roles: profileData.roles,
                status: profileData.status,
              }),
            });
            if (syncRes.ok) {
              const synced = await syncRes.json();
              if (synced.user) {
                setSystemUsers(prev => [synced.user, ...prev.filter(u => u.id !== synced.user.id)]);
                if (synced.user.role) {
                  setUserProfile(prev => prev ? { 
                    ...prev, 
                    role: synced.user.role, 
                    roles: synced.user.roles || [synced.user.role],
                    status: synced.user.status 
                  } : null);
                  setActiveRole(synced.user.role);
                }
              }
            }
          } catch (err) {
            console.warn('Could not sync user profile to API:', err);
          }
        } else {
          // If no Firebase user, check if we have local client credentials in state
          if (activeRole !== 'clinic_client' && activeRole !== 'online_subscriber' && activeRole !== 'doctor' && activeRole !== 'staff' && activeRole !== 'visitor') {
            setUserProfile(null);
            setActiveRole('guest');
          }
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Auth state listener notice:', err);
      setIsAuthLoading(false);
    }
  }, [activeRole]);

  // 3. New Client Onboarding & Fast QR Registration
  const registerNewClient = async (data: {
    firstName: string;
    lastName: string;
    phone: string;
    gender?: 'male' | 'female';
    weight?: number;
    height?: number;
    dietTemplateId?: string;
    doctorNotes?: string;
    role?: 'clinic_client' | 'online_subscriber';
  }): Promise<{ patient: Patient; qrToken: string }> => {
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
    const cleanPhone = data.phone.trim();
    const newId = `p_${Date.now()}`;
    const qrToken = `CRH_FAST_${Math.random().toString(36).substring(2, 8).toUpperCase()}_${newId}`;
    const qrCodeUrl = `https://cerrah.com/login?token=${qrToken}`;

    // Look up diet template if selected
    let assignedDiet: Diet | null = null;
    if (data.dietTemplateId) {
      const foundTemplate = dietTemplates.find(t => t.id === data.dietTemplateId);
      if (foundTemplate) {
        assignedDiet = {
          id: `diet_${newId}`,
          name: foundTemplate.name,
          instructions: foundTemplate.instructions,
          templateId: foundTemplate.id,
          assignedAt: new Date().toISOString().split('T')[0],
          doctorNotes: data.doctorNotes || '',
          waterTargetLiters: foundTemplate.waterTarget || 3,
          dailyMeals: foundTemplate.dailyMeals,
        };
      }
    }

    const assignedRole: UserRole = data.role || 'clinic_client';

    const newPatient: Patient = {
      id: newId,
      name: fullName,
      phone: cleanPhone,
      qrCodeUrl,
      qrToken,
      diet: assignedDiet,
      sessions: [],
      avatarProps: {
        gender: data.gender || 'female',
        weight: data.weight || 80,
        height: data.height || 165,
        skinTone: '#fcdbc4',
        bellyRound: 0.5,
        bellyLower: 0.3,
        bellyUpper: 0.2,
        loveHandles: 0.3,
        doubleChin: 0.1,
        chestSag: 0.1,
        armsFat: 0.2,
        armsSag: 0.1,
        thighsFat: 0.3,
        calvesFat: 0.2,
        glutesFat: 0.2,
        hasStretchMarks: false,
        hasCellulite: false
      },
      adherenceLogs: [],
      weightHistory: [
        { 
          date: new Date().toISOString().split('T')[0], 
          weight: data.weight || 80, 
          bmi: Number(((data.weight || 80) / Math.pow((data.height || 165) / 100, 2)).toFixed(1)) 
        }
      ],
      registeredBy: activeRole === 'doctor' ? 'الطبيب المعالج' : 'استقبال فرع إهناسيا',
      createdAt: new Date().toISOString(),
    };

    // Save patient in state and database
    await addPatient(newPatient);

    // Also register system user with username=Name and password=Phone
    const newSystemUser: SystemUser = {
      id: newId,
      uid: newId,
      displayName: fullName,
      phone: cleanPhone,
      email: `${cleanPhone}@cerrah-client.com`,
      role: assignedRole,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    await addSystemUser(newSystemUser);

    // Send welcome chat message
    await sendChatMessage(
      newId,
      `مرحباً بك يا ${fullName} في مركز سيرا! تم إنشاء ملفك الطبي بنجاح. اسم المستخدم للدخول: "${fullName}" وكلمة المرور: "${cleanPhone}". يمكنك دائماً تسجيل الدخول الفوري عبر كود الـ QR الخاص بك.`,
      activeRole,
      activeRole === 'doctor' ? 'د. مصطفى محمود' : 'استقبال فرع إهناسيا'
    );

    return { patient: newPatient, qrToken };
  };

  // 4. Fast QR Login and Credential Login
  const loginWithCredentials = async (name: string, phone: string): Promise<{ success: boolean; error?: string; patient?: Patient }> => {
    const trimmedName = name.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    // Check matching patient in patients or systemUsers
    const matchingPatient = patients.find(p => 
      (p.name.trim().toLowerCase() === trimmedName || p.name.includes(name.trim())) && 
      p.phone.replace(/[\s-]/g, '').includes(trimmedPhone.replace(/[\s-]/g, ''))
    );

    if (matchingPatient) {
      const clientRole: UserRole = 'clinic_client';
      const fakeUser: any = {
        uid: matchingPatient.id,
        displayName: matchingPatient.name,
        email: `${matchingPatient.phone}@cerrah-client.com`,
        phoneNumber: matchingPatient.phone,
      };
      setCurrentUser(fakeUser);
      setUserProfile({
        id: matchingPatient.id,
        displayName: matchingPatient.name,
        phone: matchingPatient.phone,
        email: `${matchingPatient.phone}@cerrah-client.com`,
        role: clientRole,
        patientId: matchingPatient.id,
      });
      setActiveRole(clientRole);
      return { success: true, patient: matchingPatient };
    }

    // Check system users
    const matchingUser = systemUsers.find(u => 
      u.displayName?.trim().toLowerCase() === trimmedName && 
      (u.phone?.replace(/[\s-]/g, '') === trimmedPhone.replace(/[\s-]/g, '') || u.email?.includes(trimmedPhone))
    );

    if (matchingUser) {
      const userRole: UserRole = (matchingUser.role as UserRole) || 'visitor';
      const fakeUser: any = {
        uid: matchingUser.uid || matchingUser.id,
        displayName: matchingUser.displayName,
        email: matchingUser.email,
        phoneNumber: matchingUser.phone,
      };
      setCurrentUser(fakeUser);
      setUserProfile({
        id: matchingUser.uid || matchingUser.id,
        displayName: matchingUser.displayName,
        phone: matchingUser.phone,
        email: matchingUser.email,
        role: userRole,
        roles: matchingUser.roles || [userRole],
        status: matchingUser.status,
      });
      setActiveRole(userRole);
      return { success: true };
    }

    return { success: false, error: 'بيانات الدخول غير مطابقة. تأكد من إدخال الاسم الثنائي ورقم الهاتف المسجل لدى المركز.' };
  };

  const registerVisitor = async (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  }): Promise<{ success: boolean; error?: string; user?: SystemUser }> => {
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
    const cleanPhone = data.phone.trim();
    const cleanName = fullName.toLowerCase();

    // 1. Duplicate check in existing patients
    const existingPatient = patients.find(p => 
      p.name.trim().toLowerCase() === cleanName || 
      p.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '')
    );
    if (existingPatient) {
      return { 
        success: false, 
        error: 'يوجد حساب عميل مسجل بالفعل بهذا الاسم أو رقم الهاتف لدى المركز. يرجى تسجيل الدخول مباشرة.' 
      };
    }

    // 2. Duplicate check in existing system users
    const existingUser = systemUsers.find(u => 
      u.displayName?.trim().toLowerCase() === cleanName || 
      (u.phone && u.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, ''))
    );
    if (existingUser) {
      return { 
        success: false, 
        error: 'يوجد حساب مسجل بالفعل بهذا الاسم أو رقم الهاتف. يرجى تسجيل الدخول عبر خيار الدخول.' 
      };
    }

    const newId = `usr_vis_${Date.now()}`;
    const newVisitor: SystemUser = {
      id: newId,
      uid: newId,
      displayName: fullName,
      phone: cleanPhone,
      email: data.email || `${cleanPhone}@cerrah-visitor.com`,
      role: 'visitor',
      roles: ['visitor'],
      status: 'pending',
      notes: 'حساب زائر مسجل جديد بانتظار التفعيل (اشتراك أونلاين أو حجز بالفرع)',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await addSystemUser(newVisitor);

    const fakeUser: any = {
      uid: newId,
      displayName: fullName,
      email: newVisitor.email,
      phoneNumber: cleanPhone,
    };
    setCurrentUser(fakeUser);
    setUserProfile({
      id: newId,
      displayName: fullName,
      phone: cleanPhone,
      email: newVisitor.email,
      role: 'visitor',
      roles: ['visitor'],
      status: 'pending',
    });
    setActiveRole('visitor');

    return { success: true, user: newVisitor };
  };

  const loginWithQrToken = async (qrTokenOrUrl: string): Promise<{ success: boolean; error?: string; patient?: Patient }> => {
    const cleanToken = qrTokenOrUrl.trim();
    
    // Find patient matching qrToken or qrCodeUrl
    const matchingPatient = patients.find(p => 
      (p.qrToken && (cleanToken.includes(p.qrToken) || p.qrToken.includes(cleanToken))) ||
      (p.qrCodeUrl && cleanToken.includes(p.qrCodeUrl)) ||
      p.id === cleanToken
    ) || patients[0]; // fallback to primary client if scanning demo QR

    if (matchingPatient) {
      const clientRole: UserRole = 'clinic_client';
      const fakeUser: any = {
        uid: matchingPatient.id,
        displayName: matchingPatient.name,
        email: `${matchingPatient.phone}@cerrah-client.com`,
        phoneNumber: matchingPatient.phone,
      };
      setCurrentUser(fakeUser);
      setUserProfile({
        id: matchingPatient.id,
        displayName: matchingPatient.name,
        phone: matchingPatient.phone,
        email: `${matchingPatient.phone}@cerrah-client.com`,
        role: clientRole,
        roles: [clientRole],
        status: 'active',
        patientId: matchingPatient.id,
      });
      setActiveRole(clientRole);
      return { success: true, patient: matchingPatient };
    }

    return { success: false, error: 'رمز الـ QR غير صالح أو منتهي الصلاحية.' };
  };

  // 5. Patient Actions
  const addPatient = async (patient: Patient) => {
    setPatients((prev) => [patient, ...prev.filter((p) => p.id !== patient.id)]);

    try {
      await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });
    } catch (error) {
      console.error('Failed to persist patient to PostgreSQL:', error);
    }
  };

  const updatePatient = async (id: string, updatedData: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );

    try {
      await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData }),
      });
    } catch (error) {
      console.error('Failed to update patient in PostgreSQL:', error);
    }
  };

  const deletePatient = async (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete patient from PostgreSQL:', error);
    }
  };

  // 6. Templates & Prescriptions Actions
  const addDietTemplate = async (template: DietTemplate) => {
    setDietTemplates((prev) => [template, ...prev.filter(t => t.id !== template.id)]);

    try {
      await fetch('/api/diet-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });
    } catch (error) {
      console.error('Failed to persist diet template to PostgreSQL:', error);
    }
  };

  const updateDietTemplate = async (id: string, updates: Partial<DietTemplate>) => {
    setDietTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    try {
      const existing = dietTemplates.find(t => t.id === id);
      if (existing) {
        await fetch('/api/diet-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...existing, ...updates }),
        });
      }
    } catch (err) {
      console.error('Failed to update template:', err);
    }
  };

  const deleteDietTemplate = async (id: string) => {
    setDietTemplates((prev) => prev.filter((t) => t.id !== id));

    try {
      await fetch(`/api/diet-templates/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete diet template from PostgreSQL:', error);
    }
  };

  const assignDietToPatient = async (patientId: string, template: DietTemplate, customNotes?: string) => {
    const targetPatient = patients.find(p => p.id === patientId);
    if (!targetPatient) return;

    const newDiet: Diet = {
      id: `diet_${Date.now()}`,
      name: template.name,
      instructions: customNotes ? `${template.instructions}\n\nملاحظات الطبيب الخاصة:\n${customNotes}` : template.instructions,
      templateId: template.id,
      assignedAt: new Date().toISOString().split('T')[0],
      doctorNotes: customNotes || '',
      waterTargetLiters: template.waterTarget || 3,
      dailyMeals: template.dailyMeals,
    };

    await updatePatient(patientId, { diet: newDiet });

    // Send automatic notification & prescription in chat
    await sendChatMessage(
      patientId,
      `📋 تم اعتماد وتحديث خطتك الغذائية والروشتة الطبية: "${template.name}". يمكنك الاطلاع على جدول الوجبات وتحميل الروشتة بصيغة PDF من لوحة التحكم الخاصة بك.`,
      activeRole,
      activeRole === 'doctor' ? 'د. مصطفى محمود' : 'طاقم المركز'
    );
  };

  // 7. Session Logging
  const logSession = async (patientId: string, newSession: Session) => {
    const targetPatient = patients.find(p => p.id === patientId);
    if (!targetPatient) return;

    const updatedSessions = [newSession, ...(targetPatient.sessions || []).filter(s => s.id !== newSession.id)];
    await updatePatient(patientId, { sessions: updatedSessions });

    // Send notification in chat that a session on that date was recorded
    const formattedDate = new Date(newSession.date).toLocaleDateString('ar-EG', { dateStyle: 'long' });
    await sendChatMessage(
      patientId,
      `🗓️ تم تسجيل حضور جلستك في المركز بتاريخ (${formattedDate}) بنجاح. شكراً لالتزامك برحلة العلاج!`,
      activeRole,
      'استقبال فرع إهناسيا'
    );
  };

  // 8. Appointments & Users
  const addAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
    const newApt: Appointment = {
      id: data.id || `apt_${Date.now()}`,
      patientName: data.patientName || '',
      phone: data.phone || '',
      email: data.email,
      service: data.service || 'استشارة عامة',
      preferredDate: data.preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: data.preferredTime || '17:00',
      status: 'pending',
      notes: data.notes,
      userId: data.userId || currentUser?.uid,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newApt, ...prev.filter((a) => a.id !== newApt.id)]);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApt),
      });
      if (res.ok) {
        const saved = await res.json();
        return saved;
      }
    } catch (err) {
      console.warn('Failed to save appointment to PostgreSQL:', err);
    }
    return newApt;
  };

  const updateAppointmentStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  ) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );

    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('Failed to update appointment status:', err);
    }
  };

  const deleteAppointment = async (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Failed to delete appointment:', err);
    }
  };

  const updateSystemUser = async (id: string, updates: Partial<SystemUser>) => {
    setSystemUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (currentUser && currentUser.uid === id && updates.role) {
        setActiveRole(updates.role);
        setUserProfile(prev => prev ? { ...prev, role: updates.role! } : null);
      }
    } catch (err) {
      console.warn('Failed to update user:', err);
    }
  };

  const addSystemUser = async (userData: Partial<SystemUser>) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setSystemUsers(prev => [data.user, ...prev.filter(u => u.id !== data.user.id)]);
        }
      }
    } catch (err) {
      console.warn('Failed to add user:', err);
    }
  };

  const deleteSystemUser = async (id: string) => {
    setSystemUsers(prev => prev.filter(u => u.id !== id));
    try {
      await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Failed to delete user:', err);
    }
  };

  const refreshUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setSystemUsers(data);
      }
    } catch (err) {
      console.warn('Failed to refresh users:', err);
    }
  };

  // 9. Chat & Communication Methods
  const sendChatMessage = async (
    patientId: string, 
    text: string, 
    senderRole?: UserRole, 
    senderName?: string
  ) => {
    const defaultSenderRole = senderRole || activeRole;
    const defaultSenderName = senderName || (
      defaultSenderRole === 'doctor' ? 'د. مصطفى محمود' :
      defaultSenderRole === 'staff' ? 'استقبال فرع إهناسيا' :
      currentUser?.displayName || 'العميل'
    );

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      patientId,
      senderRole: defaultSenderRole,
      senderName: defaultSenderName,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setChatMessages(prev => [...prev, newMsg]);

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg),
      });
    } catch (err) {
      console.warn('Failed to persist chat message:', err);
    }
  };

  const fetchChatMessages = async (patientId?: string) => {
    try {
      const url = patientId ? `/api/chat?patientId=${patientId}` : '/api/chat';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setChatMessages(data);
      }
    } catch (err) {
      console.warn('Failed to fetch chat messages:', err);
    }
  };

  // 10. Others
  const saveSimulation = async (simData: any) => {
    try {
      const res = await fetch('/api/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...simData,
          userId: currentUser?.uid,
        }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to save simulation:', err);
    }
    return simData;
  };

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider || !isFirebaseConfigured) {
      console.info('Firebase Google Auth is in preview fallback mode.');
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.warn('Google Sign-in Notice:', error);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    setUserProfile(null);
    setActiveRole('guest');

    if (!auth || !isFirebaseConfigured) return;

    try {
      await signOut(auth);
    } catch (error) {
      console.warn('Sign-out Notice:', error);
    }
  };

  return (
    <ClinicContext.Provider
      value={{
        patients,
        dietTemplates,
        appointments,
        systemUsers,
        currentUser,
        userProfile,
        activeRole,
        setActiveRole,
        isAuthLoading,
        chatMessages,
        addPatient,
        updatePatient,
        deletePatient,
        registerNewClient,
        loginWithCredentials,
        loginWithQrToken,
        registerVisitor,
        addDietTemplate,
        updateDietTemplate,
        deleteDietTemplate,
        assignDietToPatient,
        logSession,
        addAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        updateSystemUser,
        addSystemUser,
        deleteSystemUser,
        refreshUsers,
        sendChatMessage,
        fetchChatMessages,
        saveSimulation,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) throw new Error('useClinic must be used within a ClinicProvider');
  return context;
};