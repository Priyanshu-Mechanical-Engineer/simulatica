'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        setEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = email === "2022meb1331@iitrpr.ac.in";

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-700">
        Simulatica
      </Link>

      <div className="space-x-4">
        <Link href="/submit" className={navClass(pathname === "/submit")}>
          Submit
        </Link>
        <Link href="/payment" className={navClass(pathname === "/payment")}>
          Payment
        </Link>
        {email && (
          <Link href="/dashboard" className={navClass(pathname === "/dashboard")}>
            Dashboard
          </Link>
        )}
        {isAdmin && (
          <>
            <Link href="/admin/dashboard" className={navClass(pathname === "/admin/dashboard")}>
              Admin
            </Link>
            <Link href="/admin/payments" className={navClass(pathname === "/admin/payments")}>
              Receipts
            </Link>
          </>
        )}
        {!email ? (
          <Link href="/login" className="text-blue-700 font-semibold">
            Login
          </Link>
        ) : (
          <button
            onClick={() => signOut(auth)}
            className="text-red-600 font-semibold"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

function navClass(active: boolean) {
  return active ? "text-blue-700 font-semibold underline" : "text-gray-700";
}
