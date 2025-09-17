'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Bell, CheckCircle, Loader2 } from 'lucide-react';

export default function SubscriptionConfirmationModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isSubscribing,
  condoAddress,
  userEmail
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <DialogTitle className="text-xl">Subscribe to Building Updates</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Stay informed about new listings, price changes, and market updates for this building.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Building Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Building Details</h3>
            <p className="text-gray-700">{decodeURIComponent(condoAddress)}</p>
          </div>

          {/* What you'll receive */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">What you'll receive:</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">New listing notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Price change alerts</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Market insights and trends</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Weekly market reports</span>
              </div>
            </div>
          </div>

          {/* User email confirmation */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Notifications will be sent to:</strong> {userEmail}
            </p>
          </div>

          {/* Frequency info */}
          <div className="text-sm text-gray-600">
            <p>You can unsubscribe at any time from your account settings.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubscribing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubscribing}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSubscribing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Subscribe to Updates
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
