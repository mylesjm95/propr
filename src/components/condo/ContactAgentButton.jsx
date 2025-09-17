"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { createClient } from "@/utils/supabase/client";

export function ContactAgentButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  const handleClick = () => {
    if (!isLoggedIn) {
      // If not logged in, show auth modal
      setIsOpen(true);
    } else {
      // User is logged in, handle contacting agent
      // This could redirect to a contact form or open a different modal
      alert("Contact form will open here");
      // Future implementation would go here
    }
  };
  
  return (
    <>
      <Button 
        className="w-full mt-auto" 
        onClick={handleClick}
        disabled={isLoading}
      >
        Contact Agent
      </Button>
      
      {/* Only render the AuthModal when needed */}
      {!isLoggedIn && (
        <AuthModal 
          isOpen={isOpen} 
          onOpenChange={setIsOpen} 
        />
      )}
    </>
  );
}
