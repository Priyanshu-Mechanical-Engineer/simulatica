'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbx4tZX7moFmH_zVDVFm3xxaZUIZA2KzeEuvuabbSmmIdwvVRnu4mzS_smjV-4SD1uly6Q/exec';

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

export default function UserDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const email = user.email?.toLowerCase().trim() || '';
      setUserEmail(email);

      try {
        const res = await fetch(SHEET_URL);
        const result: { result: string; data: Submission[] } = await res.json();

        if (result.result === 'Success') {
          const userSubs = result.data
            .reverse()
            .filter((entry) =>
              (entry.email || '').toLowerCase().trim() === email
            );

          setSubmissions(userSubs);
        } else {
          alert('❌ Failed to fetch your projects');
        }
      } catch (error) {
        console.error('Failed to load submissions:', (error as Error).message);
        alert('❌ Failed to load your dashboard');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="p-6">Loading your dashboard...</div>;

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📋 My Submissions</h1>
      </div>

      <p className="mb-4">
        Logged in as <strong>{userEmail}</strong>
      </p>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Project Type</th>
              <th className="p-2">Description</th>
              <th className="p-2">File</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{s.projecttype}</td>
                <td className="p-2">{s.description}</td>
                <td className="p-2">
                  {s.fileurl ? (
                    <a
                      href={
                        s.fileurl.includes('/view')
                          ? s.fileurl.replace('/view?usp=drivesdk', '?export=download')
                          : s.fileurl
                      }
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  ) : (
                    'No file'
                  )}
                </td>
                <td className="p-2">{s.status || 'Under Review'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
