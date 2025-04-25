"use client";

import { useState, useEffect } from "react";
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

export default function DynamicHeader({ user }) {
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  
  // Check if user is logged in
  const isLoggedIn = !!user;

  useEffect(() => {
    // Initialize prevScrollPos with current scroll position
    setPrevScrollPos(window.scrollY);
    
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Determine if user scrolled up
      const isScrollingUp = currentScrollPos < prevScrollPos;
      
      // Update header visibility based on scroll direction
      setVisible(isScrollingUp || currentScrollPos < 10);
      
      // Set scrolled state for transparent/solid background
      setScrolled(currentScrollPos > 10);
      
      // Update previous scroll position
      setPrevScrollPos(currentScrollPos);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Clean up
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`w-full z-50 transition-all duration-300 ${
        visible ? 'transform-none' : '-translate-y-full'
      } ${
        scrolled ? 'bg-white border-b shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
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
            <UserDropdown user={user} scrolled={scrolled} />
          ) : (
            <AuthModalButton scrolled={scrolled} />
          )}
        </div>
      </div>
    </header>
  );
}

// User dropdown component for authenticated users
function UserDropdown({ user, scrolled }) {
  const userEmail = user?.email || "";
  // Get first letter of email for avatar fallback
  const initials = userEmail ? userEmail.charAt(0).toUpperCase() : "U";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
