"use client";

import { usePathname } from 'next/navigation';
import SecfiStyleHeader from './SecfiStyleHeader';

export default function ClientHeader({ user }) {
  const pathname = usePathname();
  
  // Check if the current page has a dark hero section
  // Currently, only the [condoAddress] page has a dark hero
  const hasDarkHero = pathname.match(/^\/[^\/]+$/) && pathname !== '/';
  
  return (
    <SecfiStyleHeader user={user} hasDarkHero={hasDarkHero} />
  );
}
