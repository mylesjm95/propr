"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { AuthModalButton } from "@/components/auth/AuthModalButton";

// Navigation items
const navItems = [
  { name: "Features", link: "#features" },
  { name: "Pricing", link: "#pricing" },
  { name: "Contact", link: "#contact" },
];

export default function SecfiStyleHeader({ user }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 100; // How far to scroll before changing header appearance
  
  // Check if user is logged in
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if we should show the header
      if (currentScrollY < lastScrollY.current) {
        // Scrolling up - show header
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > scrollThreshold) {
        // Scrolling down and past threshold - hide header
        setIsVisible(false);
      }
      
      // Determine if header should be transparent or white
      setIsScrolled(currentScrollY > 10);
      
      // Update reference to last scroll position
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Transparent header that shows initially and disappears on scroll */}
      <header 
        className={`w-full z-50 transition-all duration-300 absolute top-0 left-0 right-0
          ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          bg-transparent
        `}
      >
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">Propr</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, idx) => (
              <Link 
                key={`nav-item-${idx}`} 
                href={item.link}
                className="text-sm font-medium text-gray-800 hover:opacity-80"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <UserDropdown user={user} isLight={false} />
            ) : (
              <AuthModalButton isLight={false} />
            )}
          </div>
        </div>
      </header>

      {/* Fixed white header that appears when scrolling */}
      <header 
        className={`w-full z-50 transition-all duration-300 fixed top-0 left-0 right-0
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
          ${isScrolled ? 'bg-white shadow-sm' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">Propr</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, idx) => (
              <Link 
                key={`nav-item-${idx}`} 
                href={item.link}
                className="text-sm font-medium text-gray-800 hover:opacity-80"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <UserDropdown user={user} isLight={false} />
            ) : (
              <AuthModalButton isLight={false} />
            )}
          </div>
        </div>
      </header>
    </>
  );
}

// User dropdown component for authenticated users
function UserDropdown({ user, isLight }) {
  const userEmail = user?.email || "";
  // Get first letter of email for avatar fallback
  const initials = userEmail ? userEmail.charAt(0).toUpperCase() : "U";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative h-8 w-8 rounded-full ${isLight ? 'text-white hover:bg-white/20' : 'text-gray-800 hover:bg-gray-100'}`}>
          <Avatar>
            <AvatarImage 
              src={`https://avatar.vercel.sh/${userEmail}`} 
              alt={userEmail} 
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{userEmail}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <form action="/api/auth/signout" method="post">
            <button className="w-full text-left">
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
