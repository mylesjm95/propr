'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from '@/lib/actions/authActions';

export default function ProfileForm({ user, profile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      const formData = new FormData(event.target);
      const result = await updateProfile(formData);
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={user.id} />
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          name="email"
          defaultValue={user.email} 
          disabled
          className="bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          Your email address is used for login and cannot be changed here.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            name="firstName" 
            defaultValue={profile?.first_name || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            name="lastName" 
            defaultValue={profile?.last_name || ''}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          name="phone"
          type="tel"
          defaultValue={profile?.phone || ''}
        />
      </div>
      
      {message && (
        <div className={`p-3 rounded text-sm ${
          message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Update Profile'}
      </Button>
    </form>
  );
}
