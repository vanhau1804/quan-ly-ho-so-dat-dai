import { openDB, IDBPDatabase } from 'idb';
import { LandRecord } from '@/types';
import { INITIAL_MOCK_RECORDS } from '@/constants/mockData';

const DB_NAME = 'LandRecordsManagementDB';
const DB_VERSION = 1;
const STORE_NAME = 'records';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is only available in browser'));
  }

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('customerName', 'customerName', { unique: false });
          store.createIndex('recordType', 'recordType', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllRecords(): Promise<LandRecord[]> {
  if (typeof window === 'undefined') return INITIAL_MOCK_RECORDS;

  try {
    const db = await getDB();
    let records = (await db.getAll(STORE_NAME)) as LandRecord[];

    // Nếu lần đầu truy cập chưa có dữ liệu, nạp initial mock records vào IndexedDB
    if (!records || records.length === 0) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      for (const rec of INITIAL_MOCK_RECORDS) {
        await tx.store.put(rec);
      }
      await tx.done;
      records = INITIAL_MOCK_RECORDS;
    }

    // Sắp xếp hồ sơ mới nhất lên đầu
    return records.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.error('Failed to get records from IndexedDB, fallback to localStorage/mock:', err);
    const local = localStorage.getItem('land_records_cache');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return INITIAL_MOCK_RECORDS;
  }
}

export async function getRecordById(id: string): Promise<LandRecord | null> {
  if (typeof window === 'undefined') {
    return INITIAL_MOCK_RECORDS.find((r) => r.id === id) || null;
  }

  try {
    const db = await getDB();
    const record = await db.get(STORE_NAME, id);
    return record || null;
  } catch (err) {
    console.error('Failed to get record by id:', err);
    return null;
  }
}

export async function saveRecord(record: LandRecord): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const db = await getDB();
    await db.put(STORE_NAME, record);
    // backup nhẹ vào localStorage (loại bỏ base64 nặng nếu có)
  } catch (err) {
    console.error('Failed to save record to IndexedDB:', err);
    throw err;
  }
}

export async function deleteRecord(id: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
  } catch (err) {
    console.error('Failed to delete record from IndexedDB:', err);
    throw err;
  }
}

export async function importRecordsBatch(newRecords: LandRecord[]): Promise<number> {
  if (typeof window === 'undefined') return 0;

  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    let count = 0;
    for (const record of newRecords) {
      await tx.store.put(record);
      count++;
    }
    await tx.done;
    return count;
  } catch (err) {
    console.error('Failed to batch import records:', err);
    throw err;
  }
}

export async function resetToDefaultRecords(): Promise<void> {
  if (typeof window === 'undefined') return;

  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  for (const rec of INITIAL_MOCK_RECORDS) {
    await tx.store.put(rec);
  }
  await tx.done;
}

// Hàm sinh mã hồ sơ tiếp theo (HS-2026-005...)
export function generateNextRecordId(existingRecords: LandRecord[], currentYear?: number): string {
  const year = currentYear || (typeof window !== 'undefined' ? new Date().getFullYear() : 2026);
  const prefix = `HS-${year}-`;

  const existingNumbers = existingRecords
    .map((r) => {
      if (r.id.startsWith(prefix)) {
        const numPart = parseInt(r.id.replace(prefix, ''), 10);
        return isNaN(numPart) ? 0 : numPart;
      }
      return 0;
    })
    .filter((n) => n > 0);

  const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  const nextNum = (maxNumber + 1).toString().padStart(3, '0');
  return `${prefix}${nextNum}`;
}

// ================= AUTHENTICATION MOCK =================

import { User } from '@/types';

const MOCK_USERS: User[] = [
  { id: 'u1', username: 'admin', fullName: 'Quản trị viên', role: 'admin', password: '123' },
  { id: 'u2', username: 'manager', fullName: 'Lê Văn Trưởng', role: 'manager', password: '123' },
  { id: 'u3', username: 'officer1', fullName: 'Phan Thu Hà', role: 'officer', password: '123' },
  { id: 'u4', username: 'officer2', fullName: 'Lê Văn Minh', role: 'officer', password: '123' },
];

export async function login(username: string): Promise<User | null> {
  const user = MOCK_USERS.find((u) => u.username === username);
  if (user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_user', JSON.stringify(user));
    }
    return user;
  }
  return null;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('current_user');
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('current_user');
    if (data) {
      try {
        return JSON.parse(data) as User;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function getAllUsers(): User[] {
  return MOCK_USERS;
}
