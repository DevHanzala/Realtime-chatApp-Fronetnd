import { create } from 'zustand';
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
  loading: true,
  error: null,
  isLoggingOut: false,

  initAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (get().isLoggingOut) return;

      set({
        user: firebaseUser || null,
        loading: false
      });
    });
  },

  register: async (email, password, username) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', res.user.uid), {
        username,
        online: true
      });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  login: async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await updateDoc(doc(db, 'users', res.user.uid), { online: true });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  googleLogin: async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await setDoc(
        doc(db, 'users', res.user.uid),
        { username: res.user.displayName || 'Google User', online: true },
        { merge: true }
      );
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },
logout: async () => {
  set({ user: null, isLoggingOut: true }); // instant UI change

  try {
    if (auth.currentUser) {
      updateDoc(doc(db, 'users', auth.currentUser.uid), { online: false })
        .catch(() => {});
    }
    await signOut(auth);
  } finally {
    set({ isLoggingOut: false });
  }
},
clearError: () => set({ error: null }),

}));

export default useAuthStore;
