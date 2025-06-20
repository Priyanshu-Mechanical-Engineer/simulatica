'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const isAdmin = email === '2022meb1331@iitrpr.ac.in';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setEmail(user?.email ?? null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center shadow">
      <Link href="/" className="text-blue-400 font-bold text-xl">
        Simulatica
      </Link>

      <div className="space-x-4 text-sm md:text-base">
        <Link href="/submit" className={navClass(pathname === '/submit')}>
          Submit
        </Link>
        <Link href="/payment" className={navClass(pathname === '/payment')}>
          Payment
        </Link>
        {email && (
          <Link href="/dashboard" className={navClass(pathname === '/dashboard')}>
            Dashboard
          </Link>
        )}
        {isAdmin && (
          <>
            <Link
              href="/admin/dashboard"
              className={navClass(pathname === '/admin/dashboard')}
            >
              Admin
            </Link>
            <Link
              href="/admin/receipts"
              className={navClass(pathname === '/admin/receipts')}
            >
              Receipts
            </Link>
          </>
        )}
        {!email ? (
          <Link
            href="/login"
            className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={() => signOut(auth)}
            className="text-red-400 hover:text-red-500 font-semibold"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

function navClass(active: boolean) {
  return active
    ? 'text-blue-400 font-semibold underline'
    : 'text-white hover:text-blue-400';
}
