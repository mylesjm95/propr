// Client-side authentication utilities

// Client-side admin check
export async function checkAdminStatus(userId) {
  try {
    if (!userId) return { isAdmin: false };
    
    const response = await fetch('/api/check-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false, error: error.message };
  }
}
