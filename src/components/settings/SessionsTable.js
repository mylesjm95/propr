'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { logout } from '@/lib/actions/authActions';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function SessionsTable({ session, user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const supabase = createClient();
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Get user agent string from navigator
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown Device';
  
  // Handle sign out from all devices
  const handleSignOut = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred while signing out' });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3 rounded text-sm ${
          message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-muted/20 rounded-lg p-6 border">
        <h3 className="text-lg font-medium mb-4">Current Session Info</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Device / Browser</p>
              <p className="mt-1">{userAgent}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">IP Address</p>
              <p className="mt-1">{session?.ip_address || 'Not available'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="mt-1">{session?.created_at ? formatDate(session.created_at) : 'Not available'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="mt-1">{session?.updated_at ? formatDate(session.updated_at) : 'Not available'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4">Session Management</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Signing out will end your current session on this device and require you to log in again.
        </p>
        
        <Button 
          variant="destructive" 
          disabled={isLoading}
          onClick={handleSignOut}
        >
          {isLoading ? 'Signing Out...' : 'Sign Out'}
        </Button>
      </div>
    </div>
  );
}
