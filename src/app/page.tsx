'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white font-[Orbitron] overflow-x-hidden">

      {/* 🔧 Background Logo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none z-0">
        <Image
          src="/simulatica-logo.png"
          alt="Simulatica Logo"
          fill
          className="object-contain mx-auto pt-16"
          priority
        />
      </div>

      {/* 🧭 Navbar */}
      <header className="relative z-10 flex justify-between items-center px-8 py-4 bg-gray-900/70 backdrop-blur-md shadow-md">
        <h1 className="text-2xl font-bold tracking-widest text-blue-400">Simulatica</h1>
        <nav className="flex gap-6 text-sm">
          <Link href="/submit" className="hover:text-blue-300">Submit</Link>
          <Link href="/payment" className="hover:text-blue-300">Payment</Link>
          <Link href="/dashboard" className="hover:text-blue-300">Dashboard</Link>
          <Link href="/login" className="bg-blue-600 px-4 py-2 rounded shadow hover:bg-blue-700">Login</Link>
        </nav>
      </header>

      {/* 🚀 Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <h2 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-xl">
          Precision Simulations, Delivered Fast.
        </h2>
        <p className="mt-4 max-w-xl text-white/80 text-lg">
          CFD • FEA • Thermal • Urgent Industry Jobs
        </p>
        <Link href="/submit">
          <button className="mt-8 px-8 py-3 bg-blue-600 text-white text-lg rounded shadow hover:bg-blue-700">
            🚀 Get Started
          </button>
        </Link>
      </section>

      {/* 🛠️ Services */}
      <section className="relative z-10 bg-gray-900/50 px-6 py-16 text-center">
        <h3 className="text-3xl font-semibold mb-10">🔧 Our Core Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-white/90">
          {[
            ["CFD Simulation", "Air & fluid flow analysis"],
            ["FEA / Stress Analysis", "Deformation & structural failure"],
            ["Thermal Analysis", "Heat transfer and cooling studies"],
            ["Multiphase Flow", "Two-phase and slurry simulations"],
            ["Urgent Projects", "Delivery within 24-72 hrs"],
            ["Custom Cases", "Tailored physical simulations"]
          ].map(([title, desc]) => (
            <div key={title} className="bg-white/10 p-6 rounded-lg shadow hover:shadow-lg transition">
              <h4 className="text-xl font-bold mb-2 text-blue-300">{title}</h4>
              <p className="text-sm text-white/70">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 💰 Pricing Summary */}
      <section className="relative z-10 px-6 py-14 text-center bg-gradient-to-b from-gray-900/60 via-gray-900 to-transparent">
        <h3 className="text-3xl font-semibold text-white mb-6">💸 Transparent Pricing</h3>
        <p className="text-white/70 mb-4">Base starts from ₹799 + urgency charges if any.</p>
        <Link href="/submit">
          <button className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700">
            View Pricing & Submit →
          </button>
        </Link>
      </section>

      {/* ✅ Why Us */}
      <section className="relative z-10 px-6 py-16 text-center bg-gray-900/60">
        <h3 className="text-3xl font-semibold mb-6">🛡️ Why Simulatica?</h3>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8 text-white/80">
          <div>✔️ Physics-Driven Solvers</div>
          <div>✔️ Affordable Pricing</div>
          <div>✔️ Urgency Refund Guarantee</div>
          <div>✔️ 100% Data Privacy</div>
        </div>
      </section>

      {/* 📞 Footer */}
      <footer className="relative z-10 bg-gray-950 px-6 py-10 text-center text-white/60 text-sm">
        <p>📧 Contact us: <a href="mailto:support@simulatica.com" className="text-blue-400 hover:underline">support@simulatica.com</a></p>
        <p className="mt-2">© 2025 Simulatica. All rights reserved.</p>
      </footer>
    </div>
  )
}
