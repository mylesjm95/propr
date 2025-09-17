"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";

export function AuthModalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  const openModal = (tab) => {
    setActiveTab(tab);
    setIsOpen(true);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        onClick={() => openModal("login")}
      >
        Login
      </Button>
      <Button 
        variant="default" 
        onClick={() => openModal("signup")}
      >
        Sign Up
      </Button>
      <AuthModal 
        isOpen={isOpen} 
        onOpenChange={setIsOpen}
        defaultTab={activeTab}
      />
    </div>
  );
}
