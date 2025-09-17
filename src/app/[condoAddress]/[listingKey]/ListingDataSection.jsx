'use client';

import { useState } from 'react';

export default function ListingDataSection({ listing }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Fields to exclude
  const excludedFields = [
    'PublicRemarks',
    'PrivateRemarks',
    'PermissionToContactListingBrokerToAdvertise',
    'TransactionBrokerCompensation'
  ];

  // Filter the listing data
  const filteredListingData = Object.entries(listing)
    .filter(([key, value]) => {
      // Filter out excluded fields
      if (excludedFields.includes(key)) return false;
      // Filter out null, undefined, empty strings
      if (value === null || value === undefined || value === "") return false;
      // Filter out empty arrays
      if (Array.isArray(value) && value.length === 0) return false;
      // Filter out empty objects
      if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
      return true;
    })
    .filter(([key, value]) => {
      // Search filtering
      if (!searchTerm) return true;
      
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      const keyMatch = key.toLowerCase().includes(lowercaseSearchTerm);
      
      let valueMatch = false;
      if (typeof value === 'object') {
        valueMatch = JSON.stringify(value).toLowerCase().includes(lowercaseSearchTerm);
      } else {
        valueMatch = String(value).toLowerCase().includes(lowercaseSearchTerm);
      }
      
      return keyMatch || valueMatch;
    })
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  // Get the displayed item count for the counter
  const displayedItemCount = searchTerm 
    ? filteredListingData.length 
    : (isExpanded ? filteredListingData.length : Math.min(filteredListingData.length, 15));

  return (
    <div className="mt-10 mb-8">
      <h3 className="text-xl font-semibold mb-5 text-gray-800">Complete Listing Data</h3>
      
      {/* Search bar for filtering listing data */}
      <div className="mb-6 relative">
        <input 
          type="text"
          id="listing-search"
          placeholder="Search listing data..."
          className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="absolute left-3 top-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <span className="text-sm text-gray-500 mt-2 block">
          Showing <span id="results-counter">{displayedItemCount}</span> {searchTerm || isExpanded ? '' : `of ${filteredListingData.length}`} results
        </span>
      </div>
      
      <div className="rounded-lg">
        <div className="w-full">
          {filteredListingData.length > 0 ? (
            <>
              {/* Display only first 15 items when not expanded, or all when expanded or searching */}
              {(isExpanded || searchTerm ? filteredListingData : filteredListingData.slice(0, 15)).map(([key, value]) => (
                <div key={key} className="border-b border-gray-100 py-3 flex">
                  <div className="w-1/3 pr-4">
                    <p className="text-sm font-medium text-gray-600">{key}</p>
                  </div>
                  <div className="w-2/3">
                    <p className="text-sm text-gray-800 break-words">
                      {Array.isArray(value)
                        ? value.join(', ')
                        : typeof value === 'object'
                          ? JSON.stringify(value, null, 2)
                          : String(value)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Only show toggle button if there are more than 15 items and not searching */}
              {filteredListingData.length > 15 && !searchTerm && (
                <div className="mt-4 flex justify-center">
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'View Less' : 'View More'}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center py-4">No matching data found</p>
          )}
        </div>
      </div>
    </div>
  );
}
