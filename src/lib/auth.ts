// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
// import { auth } from './firebase';

// export const signUp = async (email: string, password: string) => {
//   return await createUserWithEmailAndPassword(auth, email, password);
// };

// export const login = async (email: string, password: string) => {
//   return await signInWithEmailAndPassword(auth, email, password);
// };

// export const logout = async () => {
//   return await signOut(auth);
// };
// src/lib/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "./firebase";

export const signUp = async (email: string, password: string) => {
  await createUserWithEmailAndPassword(auth, email, password);
};

export const login = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  await signOut(auth);
};

// 👇 export auth here for dashboard
export { auth };
