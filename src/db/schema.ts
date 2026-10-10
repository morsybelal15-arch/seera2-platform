import { pgTable, text, serial, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Users table (maps Firebase Auth / User Profile to PostgreSQL)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('patient'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Patients table
export const patients = pgTable('patients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  qrCodeUrl: text('qr_code_url').notNull(),
  diet: jsonb('diet'),
  sessions: jsonb('sessions').notNull(),
  avatarProps: jsonb('avatar_props').notNull(),
  userId: text('user_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Diet templates table
export const dietTemplates = pgTable('diet_templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  instructions: text('instructions').notNull(),
  type: text('type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable('contact_messages', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  inquiryType: text('inquiry_type').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Appointments and bookings table
export const appointments = pgTable('appointments', {
  id: text('id').primaryKey(),
  patientName: text('patient_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  service: text('service').notNull(),
  preferredDate: text('preferred_date').notNull(),
  preferredTime: text('preferred_time').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes: text('notes'),
  userId: text('user_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3D Avatar custom simulations table
export const simulations = pgTable('simulations', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  userName: text('user_name'),
  phone: text('phone'),
  gender: text('gender').notNull().default('female'),
  bmi: text('bmi').notNull(),
  weight: text('weight').notNull(),
  height: text('height').notNull(),
  avatarProps: jsonb('avatar_props').notNull(),
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Smart AI Consultations table
export const aiConsultations = pgTable('ai_consultations', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  userRole: text('user_role').notNull().default('guest'),
  message: text('message').notNull(),
  response: text('response').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Internal Messenger Messages table (supporting text, voice notes, and attachments per client thread)
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull(), // isolates conversation per client/patient
  senderId: text('sender_id').notNull(),
  senderName: text('sender_name').notNull(),
  senderRole: text('sender_role').notNull(), // 'client' | 'subscriber' | 'doctor' | 'staff'
  receiverRole: text('receiver_role').default('clinic'),
  text: text('text').notNull().default(''),
  messageType: text('message_type').notNull().default('text'), // 'text' | 'voice' | 'image' | 'file'
  mediaUrl: text('media_url'), // base64 or stored url
  mediaDuration: text('media_duration'), // voice recording length e.g. "0:25"
  fileName: text('file_name'), // for attachments
  fileSize: text('file_size'), // for attachments
  isRead: text('is_read').default('false'),
  createdAt: timestamp('created_at').defaultNow(),
});

