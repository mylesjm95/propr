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

export default function DynamicHeader2({ user }) {
  const [scrollState, setScrollState] = useState({
    position: "static", // static at start, fixed when scrolling back up
    isVisible: true,     // Always visible at start
    isScrolled: false,   // Has user scrolled down at all
    prevScrollY: 0       // Track previous scroll position
  });
  
  // Check if user is logged in
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < scrollState.prevScrollY;
      
      if (currentScrollY <= 10) {
        // At the top of the page - static position, transparent
        setScrollState({
          position: "static",
          isVisible: true,
          isScrolled: false,
          prevScrollY: currentScrollY
        });
      } else if (isScrollingUp) {
        // Scrolling back up - fixed position, white background
        setScrollState({
          position: "fixed",
          isVisible: true,
          isScrolled: true,
          prevScrollY: currentScrollY
        });
      } else {
        // Scrolling down - current position, may be hidden
        setScrollState({
          position: scrollState.position,
          isVisible: false,
          isScrolled: true,
          prevScrollY: currentScrollY
        });
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Initial check
    handleScroll();
    
    // Clean up
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollState.prevScrollY]);

  return (
    <header 
      className={`w-full z-50 transition-all duration-300 
        ${scrollState.position === "fixed" ? "fixed top-0 left-0 right-0" : "relative"}
        ${scrollState.isVisible ? "translate-y-0" : "-translate-y-full"}
        ${scrollState.isScrolled ? "bg-white shadow-md" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className={`text-xl font-bold ${
            scrollState.isScrolled ? 'text-gray-900' : 'text-white'
          }`}>Propr</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, idx) => (
            <Link 
              key={`nav-item-${idx}`} 
              href={item.link}
              className={`text-sm font-medium hover:opacity-80 ${
                scrollState.isScrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <UserDropdown user={user} />
          ) : (
            <AuthModalButton />
          )}
        </div>
      </div>
    </header>
  );
}

// User dropdown component for authenticated users
function UserDropdown({ user }) {
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
