'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (err) {
      console.error('❌ Logout failed:', err);
      alert('Something went wrong while logging out.');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-200 text-sm text-black px-3 py-1 rounded hover:bg-gray-300"
    >
      Logout
    </button>
  );
}

