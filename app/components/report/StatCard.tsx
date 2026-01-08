import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function StatCard({
  label,
  value,
  subtext,
  trend,
  trendValue
}: StatCardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm avoid-break hover:shadow-md transition-shadow">
      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
        {label}
      </p>

      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-bold text-gray-900">
          {value}
        </p>

        {trend && trendValue && (
          <span className={`text-lg font-semibold ${trendColors[trend]}`}>
            {trendIcons[trend]} {trendValue}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-sm text-gray-600 mt-2">
          {subtext}
        </p>
      )}
    </div>
  );
}
