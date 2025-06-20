'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import LogoutButton from '../../components/LogoutButton';

const ADMIN_EMAIL = '2022meb1331@iitrpr.ac.in';
const FORM_URL = 'https://script.google.com/macros/s/AKfycbx4tZX7moFmH_zVDVFm3xxaZUIZA2KzeEuvuabbSmmIdwvVRnu4mzS_smjV-4SD1uly6Q/exec';
const PAYMENT_URL = FORM_URL + '?function=payments';

interface Submission {
  timestamp: string;
  name: string;
  email: string;
  projecttype: string;
  description: string;
  fileurl: string;
  status?: string;
  _row: number;
}

interface Payment {
  email: string;
  receipturl: string;
  timestamp?: string;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push('/login');
      if (user.email !== ADMIN_EMAIL) {
        alert('Access denied. Not admin.');
        router.push('/');
        return;
      }

      setUserEmail(user.email);

      try {
        const [formRes, payRes] = await Promise.all([
          fetch(FORM_URL),
          fetch(PAYMENT_URL)
        ]);

        const formData = await formRes.json();
        const payData = await payRes.json();

        if (formData.result === 'Success' && payData.result === 'Success') {
          setSubmissions(formData.data.reverse());
          setPayments(payData.data);
        } else {
          alert('❌ Failed to fetch data');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        alert('❌ Network or script error.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleStatusChange = async (row: number, newStatus: string) => {
    try {
      const response = await fetch(`${FORM_URL}?function=update&row=${row}&status=${encodeURIComponent(newStatus)}`);
      const result = await response.json();
      if (result.result === 'Success') {
        setSubmissions(prev => prev.map(s => (s._row === row ? { ...s, status: newStatus } : s)));
        alert('✅ Status updated in sheet.');
      } else {
        alert('❌ Update failed: ' + result.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('❌ Network or script error.');
    }
  };

  const getReceiptLink = (email: string) => {
    const match = payments.find(p => p.email?.toLowerCase() === email?.toLowerCase());
    return match?.receipturl || null;
  };

  const getPaymentStatus = (email: string) => {
    return payments.some(p => p.email?.toLowerCase() === email?.toLowerCase()) ? 'Paid' : 'Unpaid';
  };

  if (loading) return <div className="p-6">Loading admin dashboard...</div>;

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🛠️ Admin Dashboard</h1>
        {/* <LogoutButton /> */}
      </div>
      <p className="mb-4">Welcome, <strong>{userEmail}</strong></p>

      {submissions.length === 0 ? (
        <p>No project submissions yet.</p>
      ) : (
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Project Type</th>
              <th className="p-2">Description</th>
              <th className="p-2">File</th>
              <th className="p-2">Payment</th>
              <th className="p-2">Receipt</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.projecttype}</td>
                <td className="p-2">{s.description}</td>
                <td className="p-2">
                  <a
                    href={s.fileurl?.includes('/view') ? s.fileurl.replace('/view?usp=drivesdk', '?export=download') : s.fileurl}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </td>
                <td className="p-2">{getPaymentStatus(s.email)}</td>
                <td className="p-2">
                  {getReceiptLink(s.email) ? (
                    <a
                      href={getReceiptLink(s.email) || '#'}
                      target="_blank"
                      className="text-blue-600 underline"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="p-2">
                  <select
                    className="border p-1 rounded"
                    value={s.status || 'Under Review'}
                    onChange={(e) => handleStatusChange(s._row, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Under Review</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
