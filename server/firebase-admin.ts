import { initializeApp, cert, getApps, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getServiceAccount(): Record<string, unknown> | null {
  const keyPath = resolve(__dirname, '..', 'service-account-key.json');
  if (existsSync(keyPath)) {
    const raw = readFileSync(keyPath, 'utf-8');
    return JSON.parse(raw);
  }

  const envJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (envJson) {
    try {
      return JSON.parse(Buffer.from(envJson, 'base64').toString('utf-8'));
    } catch {
      console.warn('FIREBASE_SERVICE_ACCOUNT env var is not valid base64 JSON');
    }
  }

  return null;
}

const serviceAccount = getServiceAccount();
let initialized = false;

if (serviceAccount && getApps().length === 0) {
  try {
    initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    });
    initialized = true;
    console.log('Firebase Admin SDK initialized from service account key');
  } catch (err) {
    console.error('Failed to initialize Firebase Admin SDK:', err);
  }
} else if (getApps().length === 0) {
  console.warn(
    '⚠️  Firebase Admin SDK not configured.\n' +
    '   Create a service account key:\n' +
    '   1. Go to Firebase Console → Project Settings → Service Accounts\n' +
    '   2. Click "Generate new private key"\n' +
    '   3. Save the file as "service-account-key.json" in the project root\n' +
    '   The server will then be able to create/delete users in Firebase Auth.'
  );
}

const firebaseAdmin = initialized
  ? { auth: () => getAuth(), firestore: () => getFirestore() }
  : null;

export { firebaseAdmin };
