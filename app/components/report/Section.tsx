import React from 'react';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  pageBreak?: boolean;
  id?: string;
}

export default function Section({
  title,
  subtitle,
  children,
  pageBreak = false,
  id
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-12 px-8 ${pageBreak ? 'section-break' : ''}`}
    >
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 border-b-4 border-blue-600 pb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl text-gray-600 mt-4">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}
