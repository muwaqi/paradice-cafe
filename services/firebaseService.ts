import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyARLLFHXKWMrLYYFVuUeSp9P_WLs2Ig1yc",
  authDomain: "hussain99-9e9d0.firebaseapp.com",
  databaseURL: "https://hussain99-9e9d0-default-rtdb.firebaseio.com",
  projectId: "hussain99-9e9d0",
  storageBucket: "hussain99-9e9d0.firebasestorage.app",
  messagingSenderId: "818773733968",
  appId: "1:818773733968:web:1315dd1614d61715955755",
  measurementId: "G-RF65HZZ3L8"
};

// Singleton pattern with error boundary for service initialization
const initFirebase = () => {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const db = getDatabase(app);
    return { app, db };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    throw error;
  }
};

const { db } = initFirebase();

export const subscribeToData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(db, path);
  return onValue(dataRef, (snapshot) => {
    callback(snapshot.val());
  });
};

export const updateData = async (path: string, data: any) => {
  await set(ref(db, path), data);
};

export const pushData = async (path: string, data: any) => {
  const newRef = push(ref(db, path));
  await set(newRef, data);
  return newRef.key;
};

export const deleteData = async (path: string) => {
  await remove(ref(db, path));
};