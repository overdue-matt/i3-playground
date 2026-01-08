import React from 'react';

interface KeyFindingProps {
  number: number;
  title: string;
  description: string;
  impact?: 'high' | 'medium' | 'low';
}

export default function KeyFinding({
  number,
  title,
  description,
  impact
}: KeyFindingProps) {
  const impactColors = {
    high: 'bg-red-100 text-red-800 border-red-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  return (
    <div className="border-l-4 border-blue-600 bg-white p-6 my-4 shadow-sm avoid-break">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
          {number}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl font-bold text-gray-900">
              {title}
            </h3>

            {impact && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${impactColors[impact]}`}>
                {impact} Impact
              </span>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
