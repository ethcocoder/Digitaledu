import { initializeApp, cert, getApps, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function initAdmin() {
  if (getApps().length > 0) return { auth: () => getAuth(), firestore: () => getFirestore() };

  let serviceAccount: Record<string, unknown> | null = null;

  const keyPath = resolve(__dirname, '..', 'service-account-key.json');
  if (existsSync(keyPath)) {
    serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'));
  }

  const envJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount && envJson) {
    try {
      serviceAccount = JSON.parse(Buffer.from(envJson, 'base64').toString('utf-8'));
    } catch { /* ignore */ }
  }

  if (!serviceAccount) return null;

  initializeApp({ credential: cert(serviceAccount as ServiceAccount) });
  console.log('Firebase Admin SDK initialized from service account key');
  return { auth: () => getAuth(), firestore: () => getFirestore() };
}

const admin = initAdmin();

export async function handleCreateUser(data: any, res: any) {
  if (!admin) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Firebase Admin SDK not configured' }));
    return;
  }

  const { email, password, fullName, role } = data;
  if (!email || !password || !fullName || !role) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing required fields' }));
    return;
  }

  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName: fullName });
    // Set custom claim so rules can check role from auth token
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid, email, fullName, role, status: 'active', createdAt: Date.now(),
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ uid: userRecord.uid }));
  } catch (error: any) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function handleFixUserClaims(data: any, res: any) {
  if (!admin) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Firebase Admin SDK not configured' }));
    return;
  }

  const { uid, role } = data;
  if (!uid || !role) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing uid or role' }));
    return;
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    // Also ensure Firestore doc exists
    const docRef = admin.firestore().collection('users').doc(uid);
    const snap = await docRef.get();
    if (!snap.exists) {
      await docRef.set({ uid, email: '', fullName: '', role, status: 'active', createdAt: Date.now() });
    } else {
      await docRef.update({ role });
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  } catch (error: any) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function handleDeleteUser(data: any, res: any) {
  if (!admin) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Firebase Admin SDK not configured' }));
    return;
  }

  const { uid } = data;
  if (!uid) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing uid' }));
    return;
  }

  try {
    await admin.firestore().collection('users').doc(uid).delete();
    await admin.auth().deleteUser(uid);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  } catch (error: any) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}
