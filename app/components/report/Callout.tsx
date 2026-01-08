import React from 'react';

interface CalloutProps {
  type: 'insight' | 'warning' | 'success' | 'neutral';
  children: React.ReactNode;
  title?: string;
}

export default function Callout({ type, children, title }: CalloutProps) {
  const styles = {
    insight: {
      border: 'border-l-4 border-blue-500',
      bg: 'bg-blue-50',
      icon: '💡',
      titleColor: 'text-blue-900'
    },
    warning: {
      border: 'border-l-4 border-red-500',
      bg: 'bg-red-50',
      icon: '⚠️',
      titleColor: 'text-red-900'
    },
    success: {
      border: 'border-l-4 border-green-500',
      bg: 'bg-green-50',
      icon: '✓',
      titleColor: 'text-green-900'
    },
    neutral: {
      border: 'border-l-4 border-gray-500',
      bg: 'bg-gray-50',
      icon: 'ℹ',
      titleColor: 'text-gray-900'
    }
  };

  const style = styles[type];

  return (
    <div className={`${style.border} ${style.bg} p-6 my-4 avoid-break`}>
      <div className="flex gap-3">
        <span className="text-2xl flex-shrink-0 print:text-xl">
          {style.icon}
        </span>
        <div className="flex-1">
          {title && (
            <h4 className={`font-bold text-lg mb-2 ${style.titleColor}`}>
              {title}
            </h4>
          )}
          <div className="text-gray-800 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
