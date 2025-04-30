"use client";

import { usePathname } from 'next/navigation';
import SecfiStyleHeader from './SecfiStyleHeader';

export default function ClientHeader({ user }) {
  const pathname = usePathname();
  
  // Check if the current page has a dark hero section
  // This includes both the [condoAddress] page and [listingKey] pages
  const isCondoPage = pathname.match(/^\/[^\/]+$/) && pathname !== '/';
  const isListingPage = pathname.match(/^\/[^\/]+\/[^\/]+$/);
  const hasDarkHero = isCondoPage || isListingPage;
  
  return (
    <SecfiStyleHeader user={user} hasDarkHero={hasDarkHero} />
  );
}
