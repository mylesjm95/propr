'use client';

import { useState } from 'react';

export default function TruncatedDescription({ description }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) {
    return <p>No description available</p>;
  }

  return (
    <div className="bg-white/60 text-gray-800 px-4 py-3 rounded-lg text-sm leading-relaxed relative">
      <div className={`relative ${isExpanded ? '' : 'line-clamp-4'}`}>
        <p>{description}</p>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/90 to-transparent"></div>
        )}
      </div>
      <button 
        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
}
