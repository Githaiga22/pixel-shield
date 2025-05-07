import React from "react";
import { Link } from "wouter";

const mockVerifications = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80",
    status: "Authentic",
    date: "2024-06-01",
    aiConfidence: 98,
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&q=80",
    status: "AI-Generated",
    date: "2024-06-02",
    aiConfidence: 12,
  },
];

export default function Verifications() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Verifications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockVerifications.map((v) => (
          <div key={v.id} className="bg-darkSecondary rounded-lg shadow p-4 flex flex-col md:flex-row items-center gap-4">
            <img src={v.imageUrl} alt="Verified" className="w-32 h-32 object-cover rounded-lg border" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${v.status === 'Authentic' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{v.status}</span>
                <span className="text-gray-400 text-xs">{v.date}</span>
              </div>
              <div className="text-gray-300 text-sm mb-2">AI Confidence: {v.aiConfidence}%</div>
              <div className="flex gap-2">
                <Link href={`/result/${v.id}`}><a className="text-cyan-400 hover:underline">View Result</a></Link>
                <Link href={`/history/${v.id}`}><a className="text-cyan-400 hover:underline">Edit History</a></Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 