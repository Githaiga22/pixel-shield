import React from "react";

export default function Integration() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Integration</h1>
      <p className="mb-4 text-gray-300">
        Integrate PixelShield's ZK-powered image verification into your own apps and workflows. Use our REST API to upload images, verify authenticity, and fetch edit history.
      </p>
      <div className="bg-darkSecondary rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">API Example</h2>
        <pre className="bg-gray-900 rounded p-4 text-sm overflow-x-auto text-green-200">
{`POST /api/verify
Content-Type: multipart/form-data

{
  image: <your_image_file>
}`}
        </pre>
        <p className="mt-2 text-gray-400">Get a verification result and certificate in seconds.</p>
      </div>
      <div className="bg-darkSecondary rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Features</h2>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>Easy REST API for image upload and verification</li>
          <li>Instant authenticity and AI/deepfake detection</li>
          <li>Blockchain-backed edit history</li>
          <li>Downloadable verification certificates</li>
          <li>Developer-friendly docs and support</li>
        </ul>
      </div>
    </div>
  );
} 