'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setEmail(user?.email ?? null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = email === '2022meb1331@iitrpr.ac.in';

  return (
    <header className="relative z-10 flex justify-between items-center px-8 py-4 bg-gray-900/70 backdrop-blur-md shadow-md">
      <Link href="/" className="text-2xl font-bold tracking-widest text-blue-400">
        Simulatica
      </Link>
      <nav className="flex gap-6 text-sm md:text-base items-center">
        <Link href="/submit" className={navClass(pathname === '/submit')}>
          Submit
        </Link>
        <Link href="/payment" className={navClass(pathname === '/payment')}>
          Payment
        </Link>
        {!loading && email && (
          <Link href="/dashboard" className={navClass(pathname === '/dashboard')}>
            Dashboard
          </Link>
        )}
        {!loading && isAdmin && (
          <>
            <Link href="/admin/dashboard" className={navClass(pathname === '/admin/dashboard')}>
              Admin
            </Link>
            <Link href="/admin/receipts" className={navClass(pathname === '/admin/receipts')}>
              Receipts
            </Link>
          </>
        )}
        {!loading && !email ? (
          <Link
            href="/login"
            className="bg-blue-600 px-4 py-2 rounded text-white shadow hover:bg-blue-700"
          >
            Login
          </Link>
        ) : (
          !loading && (
            <button
              onClick={() => signOut(auth)}
              className="text-red-400 hover:text-red-500 font-semibold"
            >
              Logout
            </button>
          )
        )}
      </nav>
    </header>
  );
}

function navClass(active: boolean) {
  return active
    ? 'text-blue-300 font-semibold underline'
    : 'text-white hover:text-blue-300';
}
