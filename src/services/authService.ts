import { User } from '../types';
import { dbGetUser, dbGetUserByPhone, dbSaveUser, dbSaveMemory, dbListUsers } from './db';
import {
  DEMO_USER_1,
  DEMO_USER_2,
  SAMPLE_PHOTOS_USER_1,
  SAMPLE_VIDEOS_USER_1,
  SAMPLE_DIARY_USER_1,
  SAMPLE_NOTES_USER_1,
  SAMPLE_PHOTOS_USER_2,
  SAMPLE_DIARY_USER_2,
  SAMPLE_NOTES_USER_2,
} from './sampleData';

const CURRENT_USER_SESSION_KEY = 'memoryvault_active_session_uid';

/**
 * Initializes default demo vaults if first time opening application
 */
export async function initializeDatabaseSeed(): Promise<void> {
  const users = await dbListUsers();
  if (users.length === 0) {
    // Seed Demo User 1: Elena Vance
    await dbSaveUser(DEMO_USER_1);
    for (const p of SAMPLE_PHOTOS_USER_1) await dbSaveMemory(p);
    for (const v of SAMPLE_VIDEOS_USER_1) await dbSaveMemory(v);
    for (const d of SAMPLE_DIARY_USER_1) await dbSaveMemory(d);
    for (const n of SAMPLE_NOTES_USER_1) await dbSaveMemory(n);

    // Seed Demo User 2: Marcus Chen (completely isolated)
    await dbSaveUser(DEMO_USER_2);
    for (const p of SAMPLE_PHOTOS_USER_2) await dbSaveMemory(p);
    for (const d of SAMPLE_DIARY_USER_2) await dbSaveMemory(d);
    for (const n of SAMPLE_NOTES_USER_2) await dbSaveMemory(n);
  }
}

/**
 * Secure login with mobile number and PIN
 */
export async function loginUser(phone: string, pin: string): Promise<{ success: boolean; user?: User; error?: string }> {
  await initializeDatabaseSeed();

  const cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length < 7) {
    return { success: false, error: 'Please enter a valid mobile phone number.' };
  }

  // Look up user by phone or normalized phone
  const allUsers = await dbListUsers();
  const user = allUsers.find(u => u.phone.replace(/\D/g, '') === cleanPhone);

  if (!user) {
    return { success: false, error: 'No account found with this mobile number. Please sign up!' };
  }

  if (user.pinHash && user.pinHash !== pin) {
    return { success: false, error: 'Incorrect 4-digit Security PIN. Please try again.' };
  }

  // Persist session
  localStorage.setItem(CURRENT_USER_SESSION_KEY, user.id);
  return { success: true, user };
}

/**
 * Register a brand new user with their own completely isolated memory vault
 */
export async function registerUser(
  name: string,
  phone: string,
  pin: string,
  avatarUrl?: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  await initializeDatabaseSeed();

  if (!name.trim()) {
    return { success: false, error: 'Please provide your Full Name.' };
  }

  const cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length < 7) {
    return { success: false, error: 'Please provide a valid mobile number with at least 7 digits.' };
  }

  if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
    return { success: false, error: 'Security PIN must be exactly 4 digits.' };
  }

  const existing = await dbGetUserByPhone(phone.trim());
  if (existing) {
    return { success: false, error: 'An account with this mobile number already exists. Please log in.' };
  }

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
  ];

  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    phone: phone.trim(),
    pinHash: pin,
    avatarUrl: avatarUrl || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
    createdAt: new Date().toISOString(),
    bio: 'Preserving precious moments in MemoryVault.',
  };

  await dbSaveUser(newUser);
  localStorage.setItem(CURRENT_USER_SESSION_KEY, newUser.id);
  return { success: true, user: newUser };
}

/**
 * Gets currently active session user
 */
export async function getActiveSessionUser(): Promise<User | null> {
  const uid = localStorage.getItem(CURRENT_USER_SESSION_KEY);
  if (!uid) return null;
  return await dbGetUser(uid);
}

/**
 * Logout clears session
 */
export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_SESSION_KEY);
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
  const current = await dbGetUser(userId);
  if (!current) return null;

  const updated: User = {
    ...current,
    ...updates,
  };
  await dbSaveUser(updated);
  return updated;
}
