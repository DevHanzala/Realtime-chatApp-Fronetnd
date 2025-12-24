import { create } from 'zustand';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true, // initial
  error: null,
  isLoggingOut: false,

  users: [],
  usersLoading: false,

  initAuth: () => {
    // FIXED: Set loading false after a timeout if auth listener delays
    const timeout = setTimeout(() => {
      set({ loading: false });
    }, 5000); // max 5 seconds

    onAuthStateChanged(auth, (firebaseUser) => {
      clearTimeout(timeout); // cancel timeout if auth resolves
      if (get().isLoggingOut) return;

      set({
        user: firebaseUser || null,
        loading: false // always set false when auth resolves
      });
    });
  },

  fetchUsers: async () => {
    set({ usersLoading: true });
    try {
      const snap = await getDocs(collection(db, 'users'));
      const users = snap.docs.map((d) => ({
        uid: d.id,
        ...d.data()
      }));
      set({ users, usersLoading: false });
    } catch (err) {
      console.error('fetchUsers error:', err);
      set({ usersLoading: false });
    }
  },

  register: async (email, password, username) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        username,
        online: true,
        createdAt: new Date(),
      });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  login: async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      // FIXED: Create user doc if not exists
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        username: res.user.email.split('@')[0],
        online: true,
      }, { merge: true });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  googleLogin: async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        username: res.user.displayName || 'Google User',
        online: true,
        createdAt: new Date(),
      }, { merge: true });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  logout: async () => {
    set({ user: null, isLoggingOut: true });
    try {
      if (auth.currentUser) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { online: false });
      }
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({ isLoggingOut: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;