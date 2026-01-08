import React from 'react';

interface ExecutiveSummaryProps {
  summary: string[];
}

export default function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  return (
    <div className="section-break py-12 px-8">
      <h2 className="text-4xl font-bold mb-8 text-gray-900 border-b-4 border-blue-600 pb-4">
        Executive Summary
      </h2>

      <div className="space-y-6">
        {summary.map((point, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <p className="text-lg text-gray-700 leading-relaxed pt-1">
              {point}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
