'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmitForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    description: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    setLoading(true);
    try {
      // STEP 1: Upload File to Google Drive
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const base64Data = (fileReader.result as string).split(',')[1];

        const uploadResponse = await fetch(
          'https://script.google.com/macros/s/AKfycbxoc1Y7kyoQ2_pkaqysCw-BrQZ58fVO4Wai-F1Ne3oc_ZtkYtWSPhadQbKiQ9-VR-tHaw/exec',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              fileName: file.name,
              fileData: base64Data,
              contentType: file.type,
            }),
          }
        );

        const uploadResult = await uploadResponse.json();
        if (uploadResult.result !== 'Success') {
          throw new Error('File upload failed: ' + uploadResult.message);
        }

        const fileUrl = uploadResult.fileUrl;

        // STEP 2: Submit Metadata to Google Sheet
        const formResponse = await fetch(
          'https://script.google.com/macros/s/AKfycbx4tZX7moFmH_zVDVFm3xxaZUIZA2KzeEuvuabbSmmIdwvVRnu4mzS_smjV-4SD1uly6Q/exec',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              ...formData,
              fileUrl,
            }),
          }
        );

        const formResult = await formResponse.json();
        if (formResult.result === 'Success') {
          // ✅ Redirect to payment page
          router.push('/payment');
        } else {
          throw new Error('Form submission failed');
        }
      };

      fileReader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Submit Your Project</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="projectType"
        placeholder="Project Type (CFD, Abaqus, etc.)"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        name="description"
        placeholder="Describe your project"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded h-32"
      />

      <input
        type="file"
        accept=".pdf,.zip"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Project & Pay'}
      </button>
    </form>
  );
}
