// app/components/TriggerDailyEmailButton.js
'use client';

import { useState } from 'react';

export default function TriggerDailyEmailButton() {
  const [status, setStatus] = useState('');

  const handleClick = async () => {
    setStatus('Sending...');
    try {
      const res = await fetch('/api/daily-listings', {
        method: 'POST',
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('✅ Email(s) sent');
      } else {
        setStatus(`❌ Error: ${data.error || res.statusText}`);
      }
    } catch (err) {
      setStatus(`❌ Failed to send: ${err.message}`);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Send Daily Listings Email
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
