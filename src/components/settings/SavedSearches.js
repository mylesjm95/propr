'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { deleteSavedSearch } from '@/lib/actions/savedSearchActions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SavedSearches({ user, savedSearches = [] }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();
  
  const handleDeleteSearch = async (searchId, buildingAddress) => {
    setIsDeleting(true);
    setDeletingId(searchId);
    
    try {
      const result = await deleteSavedSearch(searchId);
      
      if (result.success) {
        toast.success(result.message);
        router.refresh(); // Refresh the page to update the list
      } else {
        toast.error(result.error || 'Failed to delete saved search');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the saved search');
      console.error('Delete saved search error:', error);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  if (!savedSearches.length) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">You don&apos;t have any saved searches yet.</p>
        <p className="text-sm mt-2 text-muted-foreground">
          When viewing a condo building, click &quot;Save Building&quot; to get alerts about new listings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        You&apos;ll receive email notifications when new listings appear at these buildings.
      </div>
      
      <div className="space-y-3">
        {savedSearches.map((search, index) => {
          // Format the date
          const createdDate = new Date(search.createdAt);
          const formattedDate = new Intl.DateTimeFormat('en-US', { 
            year: 'numeric',
            month: 'short', 
            day: 'numeric'
          }).format(createdDate);
          
          // Extract building address from JSON field
          const buildingAddress = typeof search.buildingAddress === 'string' 
            ? search.buildingAddress 
            : search.buildingAddress?.address || search.buildingAddress?.displayName || 'Unknown Address';
          
          return (
            <div key={search.id || index} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex flex-col">
                <h3 className="font-medium">{buildingAddress}</h3>
                <p className="text-sm text-muted-foreground">Saved on {formattedDate}</p>
                <p className="text-xs text-muted-foreground">Email frequency: {search.emailFrequency}</p>
              </div>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDeleteSearch(search.id, buildingAddress)}
                disabled={isDeleting && deletingId === search.id}
              >
                {isDeleting && deletingId === search.id ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
