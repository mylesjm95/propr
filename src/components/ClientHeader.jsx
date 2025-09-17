"use client";

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import SecfiStyleHeader from './SecfiStyleHeader';

export default function ClientHeader() {
  const pathname = usePathname();
  const { user, userRole, loading } = useAuth();
  
  // Check if the current page has a dark hero section
  // This includes both the [condoAddress] page and [listingKey] pages
  const isCondoPage = pathname.match(/^\/[^\/]+$/) && pathname !== '/';
  const isListingPage = pathname.match(/^\/[^\/]+\/[^\/]+$/);
  const hasDarkHero = isCondoPage || isListingPage;
  
  return (
    <SecfiStyleHeader user={user} userRole={userRole} hasDarkHero={hasDarkHero} loading={loading} />
  );
}
