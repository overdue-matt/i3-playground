import React from 'react';

interface CoverPageProps {
  clientName: string;
  reportTitle: string;
  reportDate: string;
  logoUrl?: string;
}

export default function CoverPage({
  clientName,
  reportTitle,
  reportDate,
  logoUrl
}: CoverPageProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between items-center p-12 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white section-break">
      {/* Logo */}
      {logoUrl && (
        <div className="w-32 h-32 mb-8">
          <img src={logoUrl} alt="Impact3 Logo" className="w-full h-full object-contain" />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl">
        <h1 className="text-6xl font-bold mb-6 tracking-tight">
          {reportTitle}
        </h1>
        <div className="w-24 h-1 bg-green-400 mb-8"></div>
        <h2 className="text-4xl font-light mb-4">
          {clientName}
        </h2>
        <p className="text-xl text-gray-300">
          {reportDate}
        </p>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          Prepared by Impact3
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Capital Markets Marketing & Investor Relations
        </p>
      </div>
    </div>
  );
}
