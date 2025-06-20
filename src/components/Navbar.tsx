'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = '2022meb1331@iitrpr.ac.in';

export default function Navbar() {
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setUserEmail(user.email);
        setIsAdmin(user.email === ADMIN_EMAIL);
      } else {
        setUserEmail('');
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-400">
        <Link href="/">Simulatica</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link href="/submit">Submit</Link>
        {/* <Link href="/payment">Payment</Link> */}
        <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"}>Dashboard</Link>
        {/* ✅ Show Receipts to both, with different routes */}
        <Link href={isAdmin ? "/admin/receipts" : "/receipts"}>Receipts</Link>
        {userEmail && (
          <button onClick={handleLogout} className="text-red-400 hover:underline">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
