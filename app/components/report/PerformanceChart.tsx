import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface PerformanceChartProps {
  data: ChartData[];
  title?: string;
  maxValue?: number;
}

export default function PerformanceChart({
  data,
  title,
  maxValue
}: PerformanceChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value));

  return (
    <div className="my-6 avoid-break">
      {title && (
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          {title}
        </h4>
      )}

      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.value / max) * 100;
          const bgColor = item.color || 'bg-blue-600';

          return (
            <div key={index} className="avoid-break">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {item.value.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className={`${bgColor} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 15 && (
                    <span className="text-xs font-semibold text-white">
                      {percentage.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
