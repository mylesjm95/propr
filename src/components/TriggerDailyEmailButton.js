'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import SubscriptionConfirmationModal from '@/components/condo/SubscriptionConfirmationModal';
import { subscribeToBuildingUpdates } from '@/lib/actions/subscriptionActions';
import { toast } from 'sonner';

export default function TriggerDailyEmailButton({ condoAddress }) {
  const { user, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleButtonClick = () => {
    if (loading) return; // Don't do anything while loading
    
    if (!user) {
      // User not logged in, open auth modal
      setIsAuthModalOpen(true);
    } else {
      // User is logged in, open subscription confirmation modal
      setIsSubscriptionModalOpen(true);
    }
  };

  const handleSubscriptionConfirm = async () => {
    setIsSubscribing(true);
    
    try {
      const formData = new FormData();
      formData.append('buildingAddress', condoAddress);
      
      const result = await subscribeToBuildingUpdates(formData);
      
      if (result.success) {
        // Close modal and show success message
        setIsSubscriptionModalOpen(false);
        toast.success('Successfully subscribed to building updates!', {
          description: `You'll receive notifications about ${decodeURIComponent(condoAddress)}`
        });
      } else {
        // Show error message
        toast.error('Failed to subscribe', {
          description: result.error || 'Something went wrong. Please try again.'
        });
      }
      
    } catch (error) {
      console.error('Error subscribing to updates:', error);
      toast.error('Failed to subscribe', {
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return null; // Don't show button while loading
  }

  return (
    <>
      {/* Button */}
      <Button
        onClick={handleButtonClick}
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
      >
        <Bell className="h-5 w-5 mr-2" />
        Send Daily Listings Email
      </Button>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen}
        defaultTab="signup"
        buildingAddress={condoAddress}
      />

      {/* Subscription Confirmation Modal */}
      <SubscriptionConfirmationModal
        isOpen={isSubscriptionModalOpen}
        onOpenChange={setIsSubscriptionModalOpen}
        onConfirm={handleSubscriptionConfirm}
        isSubscribing={isSubscribing}
        condoAddress={condoAddress}
        userEmail={user?.email}
      />
    </>
  );
}
