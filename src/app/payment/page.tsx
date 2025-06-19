'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const [userEmail, setUserEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4tZX7moFmH_zVDVFm3xxaZUIZA2KzeEuvuabbSmmIdwvVRnu4mzS_smjV-4SD1uly6Q/exec';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setUserEmail(user.email || '');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleUpload = async () => {
    if (!file || !userEmail) {
      alert('Please select a file and make sure you are logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('function', 'paymentUpload');
    formData.append('email', userEmail);
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      const result = await res.json();
      if (result.result === 'Success') {
        alert('✅ Payment receipt uploaded successfully!');
        setFile(null);
      } else {
        alert('❌ Upload failed: ' + result.message);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('❌ Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">💰 Payment Portal</h1>

      <p className="mb-4">Send payment to the UPI ID below and upload your receipt:</p>

      <div className="mb-4 border p-4 rounded bg-gray-50">
        <p><strong>UPI ID:</strong> <code className="text-blue-600">simulatica@upi</code></p>
        <p><strong>Amount:</strong> ₹499 (example)</p>
        <img src="/qr-code.png" alt="QR Code" className="w-40 h-40 mt-2" />
      </div>

      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {uploading ? 'Uploading...' : 'Upload Receipt'}
      </button>
    </div>
  );
}
