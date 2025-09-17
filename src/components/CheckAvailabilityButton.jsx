"use client";
import { useState } from "react";

export default function CheckAvailabilityButton() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/test-users");
      const data = await res.json();
      setResult(data.users || data.error);
    } catch (err) {
      setResult("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Checking..." : "Check Availability"}
      </button>
      <pre style={{ marginTop: 16, color: "#333", background: "#f6f6f6", padding: 8, borderRadius: 4 }}>
        {result ? JSON.stringify(result, null, 2) : null}
      </pre>
    </div>
  );
}
