'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const ADMIN_EMAIL = '2022meb1331@iitrpr.ac.in';
const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email || '';
        router.push(userEmail === ADMIN_EMAIL ? '/admin' : '/dashboard');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      console.error(err);
      setError('❌ Google login failed.');
    }
  };

  const handleEmailLogin = async () => {
    setError('');
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.includes('google.com') && !methods.includes('password')) {
        alert('⚠️ This email is registered with Google. Please log in with Google.');
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Link password if not already linked
      if (!methods.includes('password')) {
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(userCredential.user, credential);
        console.log('✅ Linked password login with Google account.');
      }

      router.push(email === ADMIN_EMAIL ? '/admin' : '/dashboard');
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(`❌ ${message}`);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('📩 Enter your email to reset password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('✅ Password reset email sent!');
    } catch (err: unknown) {
      console.error(err);
      alert('❌ Failed to send reset email.');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md p-8 rounded max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">🔐 Login to Simulatica</h1>

        {error && <p className="text-red-600 mb-3 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />

        <button
          onClick={handleEmailLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
        >
          Login with Email
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 mb-4"
        >
          Sign in with Google
        </button>

        <p
          onClick={handleForgotPassword}
          className="text-blue-600 text-sm underline text-center cursor-pointer"
        >
          Forgot Password?
        </p>
      </div>
    </div>
  );
}
