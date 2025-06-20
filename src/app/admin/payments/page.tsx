'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LogoutButton from '@/components/LogoutButton';

const ADMIN_EMAIL = '2022meb1331@iitrpr.ac.in';
const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbx4tZX7moFmH_zVDVFm3xxaZUIZA2KzeEuvuabbSmmIdwvVRnu4mzS_smjV-4SD1uly6Q/exec?function=getPayments';

interface PaymentRecord {
  timestamp: string;
  email: string;
  filename: string;
  fileurl: string;
  _row: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      if (user.email !== ADMIN_EMAIL) {
        alert('Access denied: Admins only');
        router.push('/');
        return;
      }

      setUserEmail(user.email);

      try {
        const res = await fetch(SCRIPT_URL);
        const result = await res.json();
        if (result.result === 'Success') {
          setPayments(result.data.reverse());
        } else {
          alert('❌ Failed to fetch payment records');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        alert('❌ Network error while loading payments');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="p-6">Loading payments...</div>;

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">💳 Admin: Payment Receipts</h1>
        <LogoutButton />
      </div>

      <p className="mb-4">Logged in as <strong>{userEmail}</strong></p>

      {payments.length === 0 ? (
        <p>No payment uploads found.</p>
      ) : (
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Timestamp</th>
              <th className="p-2">Email</th>
              <th className="p-2">Filename</th>
              <th className="p-2">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{p.timestamp}</td>
                <td className="p-2">{p.email}</td>
                <td className="p-2">{p.filename}</td>
                <td className="p-2">
                  <a
                    href={p.fileurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View / Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
