import React from "react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a1a2f] to-[#1a2a4f] text-white">
      <nav className="flex justify-between items-center px-8 py-4 bg-[#0a1a2f]">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl text-cyan-400">🛡️ PixelShield</span>
        </div>
        <div className="space-x-6">
          <Link href="/">
            <a className="hover:underline">Home</a>
          </Link>
          <Link href="/login">
            <a className="px-4 py-2 border border-cyan-400 rounded hover:bg-cyan-400 hover:text-[#0a1a2f] transition">Login</a>
          </Link>
        </div>
      </nav>
      <main className="flex flex-1 flex-col md:flex-row items-center justify-between px-8 py-12 max-w-7xl mx-auto w-full">
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Verify <span className="text-cyan-400">Image Authenticity</span><br />with ZK Proofs
          </h1>
          <p className="text-lg text-gray-300">
            Ensure trust in digital media by proving the authenticity and edit history of images. Our ZK-powered verification stack helps developers and users detect AI-generated or manipulated content with ease.
          </p>
          <Link href="/">
            <a className="inline-block bg-cyan-400 text-[#0a1a2f] px-6 py-3 rounded font-semibold shadow hover:bg-cyan-300 transition">Get Started for free</a>
          </Link>
        </div>
        <div className="relative mt-10 md:mt-0 md:ml-12">
          <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80" alt="Group selfie" className="rounded-xl w-80 h-80 object-cover shadow-lg" />
          <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">AI Generated</span>
          <span className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">Authentic image</span>
        </div>
      </main>
      <div className="flex flex-wrap justify-center gap-4 py-6 border-t border-gray-700 bg-[#101c33]">
        <div className="flex items-center space-x-2">
          <span className="text-cyan-400">🔒</span>
          <span>ZK-Powered Image Verification</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-cyan-400">📝</span>
          <span>Tamper-Proof Edit History</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-cyan-400">⛓️</span>
          <span>Blockchain-Backed Security</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-cyan-400">🤖</span>
          <span>AI-Deepfake Detection</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-cyan-400">⚡</span>
          <span>Instant Authentication</span>
        </div>
      </div>
      <footer className="text-center py-4 text-gray-400 bg-[#0a1a2f] border-t border-gray-800">
        Copyright © 2025 PixelShield. All Rights Reserved
      </footer>
    </div>
  );
} 