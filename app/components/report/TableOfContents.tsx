import React from 'react';

interface TOCItem {
  title: string;
  page?: number;
  subsections?: string[];
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <div className="section-break py-12 px-8">
      <h2 className="text-4xl font-bold mb-8 text-gray-900 border-b-4 border-blue-600 pb-4">
        Table of Contents
      </h2>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xl font-semibold text-gray-900">
                {item.title}
              </h3>
              {item.page && (
                <span className="text-gray-600 font-mono">
                  {item.page}
                </span>
              )}
            </div>

            {item.subsections && item.subsections.length > 0 && (
              <ul className="mt-2 ml-6 space-y-1">
                {item.subsections.map((subsection, subIndex) => (
                  <li key={subIndex} className="text-gray-600">
                    • {subsection}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
