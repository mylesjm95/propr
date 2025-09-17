'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiEdit2, FiSave, FiX, FiExternalLink } from 'react-icons/fi';
import { removeFromFavorites } from '@/lib/actions/favorites';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function FavoriteListingCard({ listingKey, listing, media, favoriteInfo, handleNoteUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(favoriteInfo.note || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Format date added
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle removing from favorites
  const handleRemoveFavorite = async () => {
    const formData = new FormData();
    formData.append('listing_key', listingKey);
    formData.append('listing_address', listing?.UnparsedAddress || favoriteInfo.address);
    
    const result = await toggleFavoriteListing(formData);
    if (result.success) {
      router.refresh();
    }
  };

  // Handle note update submission
  const handleSubmitNote = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('listing_key', listingKey);
    formData.append('note', note);
    
    const result = await handleNoteUpdate(formData);
    
    setIsSubmitting(false);
    if (!result?.error) {
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Listing Image */}
      <div className="relative h-48 w-full">
        {media?.MediaURL ? (
          <Image
            src={`/image-proxy?url=${encodeURIComponent(media.MediaURL)}`}
            alt={`Image of ${listing?.UnparsedAddress || favoriteInfo.address}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>
      
      {/* Listing Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">
          {listing?.UnparsedAddress || favoriteInfo.address}
        </h3>
        
        {listing && (
          <>
            <p className="text-lg font-semibold mb-2">${listing.ListPrice?.toLocaleString()}</p>
            <div className="flex items-center gap-4 mb-3 text-sm">
              {listing.BedroomsTotal && (
                <div>
                  {listing.BedroomsTotal} {listing.BedroomsTotal === 1 ? 'BD' : 'BDs'}
                </div>
              )}
              {listing.BathroomsTotalInteger && (
                <div>
                  {listing.BathroomsTotalInteger} {listing.BathroomsTotalInteger === 1 ? 'BA' : 'BAs'}
                </div>
              )}
              {listing.LivingAreaRange && (
                <div>{listing.LivingAreaRange} sqft</div>
              )}
            </div>
          </>
        )}
        
        {!listing && (
          <div className="mb-4 py-2 px-3 bg-amber-50 text-amber-800 rounded text-sm">
            This listing may no longer be active
          </div>
        )}
        
        <div className="text-sm text-gray-500 mb-3">
          Added on {formatDate(favoriteInfo.added_at)}
        </div>
        
        {/* Notes Section */}
        <div className="border-t pt-3 mt-2">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-sm">Notes</h4>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FiEdit2 size={16} />
              </button>
            ) : (
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setNote(favoriteInfo.note || '');
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmitNote}>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                placeholder="Add your notes here..."
                rows={3}
                disabled={isSubmitting}
              ></textarea>
              <div className="mt-2 flex justify-end">
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={isSubmitting}
                  className="flex items-center gap-1"
                >
                  <FiSave size={14} />
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-gray-700 min-h-[3em]">
              {favoriteInfo.note || <span className="text-gray-400 italic">No notes added</span>}
            </p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 flex justify-between gap-2">
          {listing?.ListingKey && (
            <Link 
              href={`/listings/${listing.ListingKey}`}
              className="flex-1"
            >
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-1"
              >
                <FiExternalLink size={14} />
                View Listing
              </Button>
            </Link>
          )}
          <Button 
            variant="outline"
            className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            onClick={handleRemoveFavorite}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
