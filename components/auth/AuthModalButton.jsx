"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";

export function AuthModalButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button 
        variant="default" 
        onClick={() => setIsOpen(true)}
      >
        Sign In
      </Button>
      <AuthModal 
        isOpen={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  );
}
