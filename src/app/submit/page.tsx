'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const basePrices: Record<string, number> = {
  'CFD Simulation': 999,
  'FEA/Stress Analysis': 799,
  'Thermal Analysis': 899,
  'Multiphase Flow': 1299,
  'Industry Urgent Job': 2999,
};

const urgencyCharges: Record<string, number> = {
  '5–7 days': 0,
  '2–3 days': 599,
  '<24 hours': 1199,
};

export default function SubmitForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'CFD Simulation',
    urgency: '5–7 days',
    description: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getTotalPrice = () => {
    const base = basePrices[formData.projectType] || 0;
    const urgency = urgencyCharges[formData.urgency] || 0;
    return base + urgency;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");
    const totalPrice = getTotalPrice();
    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];

        const uploadRes = await fetch(
          'https://script.google.com/macros/s/AKfycbxoc1Y7kyoQ2_pkaqysCw-BrQZ58fVO4Wai-F1Ne3oc_ZtkYtWSPhadQbKiQ9-VR-tHaw/exec',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              fileName: file.name,
              fileData: base64Data,
              contentType: file.type,
            }),
          }
        );

        const uploadResult = await uploadRes.json();
        if (uploadResult.result !== 'Success') throw new Error('❌ File upload failed');

        const fileUrl = uploadResult.fileUrl;

        const metadataRes = await fetch(
          'https://script.google.com/macros/s/AKfycbx4tZX7moFmH_zVDVFm3xxaZUIZA2KzeEuvuabbSmmIdwvVRnu4mzS_smjV-4SD1uly6Q/exec',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              ...formData,
              fileUrl,
              price: totalPrice.toString(),
            }),
          }
        );

        const metaResult = await metadataRes.json();
        if (metaResult.result === 'Success') {
          alert('✅ Submitted! Redirecting to payment...');
          router.push('/payment');
        } else {
          throw new Error('❌ Metadata upload failed');
        }
      };

      reader.readAsDataURL(file);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Something went wrong during submission.';
      alert("❌ " + message);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="relative min-h-screen bg-[#0A0D14] text-white overflow-hidden font-[Orbitron]">
      {/* 🔧 Branded Background - Simulatica with Gears */}
      <div className="absolute inset-0 z-0 flex justify-center items-start pointer-events-none select-none">
        <div className="relative mt-24 text-[150px] font-extrabold tracking-wider text-white/10 drop-shadow-lg">
          Simulat
          <span className="inline-block relative text-orange-400">
            ica
            <svg
              viewBox="0 0 100 100"
              className="absolute -top-6 -left-12 w-[130px] h-[130px] text-orange-500 animate-spin-slow"
              fill="currentColor"
            >
              <path d="M49.7,20a30,30,0,1,0,30,30A30,30,0,0,0,49.7,20Zm0,52a22,22,0,1,1,22-22A22,22,0,0,1,49.7,72Z" />
              <path d="M49.7,0v12a38,38,0,0,1,0,76v12a50,50,0,0,0,0-100Z" />
            </svg>
          </span>
        </div>
      </div>

      {/* 🌊 Wave Animation */}
      <div className="absolute bottom-0 left-0 right-0 z-0 overflow-hidden">
        <svg
          className="w-[300%] animate-wave-motion"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C150,20 350,100 600,60 C850,20 1050,100 1200,60 L1200,120 L0,120 Z"
            fill="#0ea5e9"
            fillOpacity="0.25"
          />
        </svg>
      </div>

      {/* 📝 Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-2xl mx-auto bg-white/10 backdrop-blur-lg p-8 mt-16 rounded-xl shadow-xl space-y-6 border border-white/30"
      >
        <h2 className="text-3xl font-bold text-white mb-4">📤 Submit Your Project</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="w-full p-3 border border-white/20 bg-[#1B1F29] text-white placeholder-gray-400 rounded-md"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-3 border border-white/20 bg-[#1B1F29] text-white placeholder-gray-400 rounded-md"
        />

        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          required
          className="w-full p-3 border border-white/20 bg-[#1B1F29] text-white rounded-md"
        >
          {Object.keys(basePrices).map((type) => (
            <option key={type} value={type} className="text-black">
              {type}
            </option>
          ))}
        </select>

        <select
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          required
          className="w-full p-3 border border-white/20 bg-[#1B1F29] text-white rounded-md"
        >
          {Object.keys(urgencyCharges).map((urg) => (
            <option key={urg} value={urg} className="text-black">
              {urg}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Describe your project"
          onChange={handleChange}
          required
          className="w-full p-3 border border-white/20 bg-[#1B1F29] text-white placeholder-gray-400 rounded-md h-32"
        />

        <input
          type="file"
          accept=".pdf,.zip"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          className="w-full p-3 border border-white/20 bg-[#1B1F29] text-white file:mr-2 file:bg-blue-700 file:text-white file:px-3 file:py-1 file:rounded-md"
        />

        <div className="border-t border-white/20 pt-4 text-sm">
          <p className="text-white">📦 Base Price: ₹{basePrices[formData.projectType]}</p>
          <p className="text-white">⚡ Urgency Charge: ₹{urgencyCharges[formData.urgency]}</p>
          <p className="text-xl font-bold text-green-300 mt-2">
            💵 Grand Total: ₹{totalPrice}
          </p>
          <p className="mt-2 text-xs text-white/70">
            ⏱️ If we cannot deliver within your selected urgency, urgency fees will be refunded.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold px-6 py-3 rounded shadow-lg"
        >
          {loading ? 'Submitting...' : 'Submit & Pay'}
        </button>
      </form>
    </div>
  );
}
