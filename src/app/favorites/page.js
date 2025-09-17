import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getFavoriteListings, updateFavoriteNote } from '@/lib/actions/favorites';
import { fetchListingsByKeys, fetchSingleMediaForListing } from '@/lib/actions/listingActions';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import FavoriteListingCard from '@/components/FavoriteListingCard';

export default async function FavoritesPage() {
  const supabase = await createClient();
  
  // Verify the user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/');
  }
  
  // Get user's favorite listings
  const { data: favoritesData, error: favoritesError } = await getFavoriteListings();
  
  if (favoritesError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{favoritesError}</p>
        </div>
      </div>
    );
  }
  
  // Process favorites to fetch current listing data
  const favorites = favoritesData || {};
  const favoriteEntries = Object.entries(favorites);
  
  // Get all listing keys from favorites
  const listingKeys = favoriteEntries.map(([key]) => key);
  
  // Fetch all listings data in a single API call
  const listingsData = await fetchListingsByKeys(listingKeys);
  
  // Create a map for quick lookup of listing data by key
  const listingsMap = {};
  for (const listing of listingsData) {
    listingsMap[listing.ListingKey] = listing;
  }
  
  // Fetch media for each listing and combine all data
  const favoriteListings = await Promise.all(
    favoriteEntries.map(async ([listingKey, favoriteInfo]) => {
      try {
        // Get listing data from our map (or null if not found)
        const listing = listingsMap[listingKey] || null;
        
        // Fetch media separately (this still needs individual calls)
        const mediaData = await fetchSingleMediaForListing(listingKey);
        
        return {
          listingKey,
          listingData: listing,
          media: mediaData,
          favoriteInfo
        };
      } catch (error) {
        console.error(`Error processing listing ${listingKey}:`, error);
        // Return partial data with the saved address if anything fails
        return {
          listingKey,
          listingData: null,
          favoriteInfo
        };
      }
    })
  );
  
  // Server action to handle note updates
  async function handleNoteUpdate(formData) {
    'use server';
    
    const result = await updateFavoriteNote(formData);
    
    if (result.error) {
      return { error: result.error };
    }
    
    revalidatePath('/favorites');
    return { success: true };
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Favorite Listings</h1>
      </div>

      {favoriteEntries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Favorites Yet</h2>
          <p className="text-gray-600 mb-6">You haven&apos;t added any listings to your favorites yet.</p>
          <Link href="/listings">
            <Button>Browse Listings</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteListings.map((item) => (
            <FavoriteListingCard
              key={item.listingKey}
              listingKey={item.listingKey}
              listing={item.listingData}
              media={item.media}
              favoriteInfo={item.favoriteInfo}
              handleNoteUpdate={handleNoteUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
