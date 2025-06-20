'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = '2022meb1331@iitrpr.ac.in';
const PAYMENTS_URL = 'https://script.google.com/macros/s/AKfycbx4tZX7moFmH_zVDVFm3xxaZUIZA2KzeEuvuabbSmmIdwvVRnu4mzS_smjV-4SD1uly6Q/exec?function=getPayments';

interface PaymentRecord {
  timestamp: string;
  email: string;
  filename: string;
  fileurl: string;
}

export default function AdminReceiptsPage() {
  const [userEmail, setUserEmail] = useState('');
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) return router.push('/login');
      const email = user.email ?? '';
      if (email !== ADMIN_EMAIL) return router.push('/');
      setUserEmail(email);

      try {
        const res = await fetch(PAYMENTS_URL);
        const result = await res.json();
        if (result.result === 'Success') {
          setPayments(result.data.reverse());
        }
      } catch (error) {
        alert('Failed to fetch payments.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="p-6">Loading receipts...</div>;

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">🧾 All Uploaded Receipts (Admin)</h1>
      </div>
      <p className="mb-4">Logged in as <strong>{userEmail}</strong></p>

      {payments.length === 0 ? (
        <p>No receipts found.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Time</th>
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
