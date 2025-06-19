'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase'; // your initialized Firebase app

const ADMIN_EMAIL = '2022meb1331@iitrpr.ac.in';
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbx4tZX7moFmH_zVDVFm3xxaZUIZA2KzeEuvuabbSmmIdwvVRnu4mzS_smjV-4SD1uly6Q/exec';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === ADMIN_EMAIL) {
        setUser(user);
        fetchSubmissions();
      } else {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch(SHEET_API_URL + '?read=true');
      const data = await res.json();
      setSubmissions(data.rows);
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (index: number, status: string) => {
    try {
      const res = await fetch(SHEET_API_URL + '?update=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ row: index + 2, status }), // +2 because Google Sheets index starts at 1 and header is row 1
      });
      const result = await res.json();
      if (result.result === 'Success') {
        alert('Status updated');
        fetchSubmissions();
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) return <div className="p-6">Loading submissions...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Time</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Project Type</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">File</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((item, idx) => (
            <tr key={idx}>
              <td className="border p-2">{item[0]}</td>
              <td className="border p-2">{item[1]}</td>
              <td className="border p-2">{item[2]}</td>
              <td className="border p-2">{item[3]}</td>
              <td className="border p-2 max-w-xs overflow-x-auto">{item[4]}</td>
              <td className="border p-2">
                <a
                  href={item[5]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View File
                </a>
              </td>
              <td className="border p-2">
                <select
                  value={item[6] || 'Under Review'}
                  onChange={(e) => handleStatusChange(idx, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option>Under Review</option>
                  <option>Processing</option>
                  <option>Done</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
