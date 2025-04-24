"use client";

import { useState } from "react";
import { login, signup } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthModal({ isOpen, onOpenChange, defaultTab = "login" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    // For signup, validate that passwords match
    if (activeTab === "signup") {
      if (password !== confirmPassword) {
        setPasswordsMatch(false);
        return;
      }
    }
    
    const formData = new FormData(e.target);
    try {
      const result = activeTab === "login" 
        ? await login(formData)
        : await signup(formData);
        
      if (result?.error) {
        setErrorMessage(result.error);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Auth error:", error);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword) {
      setPasswordsMatch(e.target.value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(password === e.target.value);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setErrorMessage("");
    setPassword("");
    setConfirmPassword("");
    setPasswordsMatch(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Skyscrapr</DialogTitle>
          <DialogDescription>
            Join our community of property enthusiasts
          </DialogDescription>
        </DialogHeader>
        
        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full mt-4"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {activeTab === "login" && errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
              
              <Button type="submit" className="w-full mt-2">
                Sign In
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  value={password}
                  onChange={handlePasswordChange}
                  className={!passwordsMatch && confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={!passwordsMatch && confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {!passwordsMatch && confirmPassword && (
                  <p className="text-xs text-destructive mt-1">Passwords don't match</p>
                )}
                {passwordsMatch && confirmPassword && (
                  <p className="text-xs text-green-500 mt-1">Passwords match</p>
                )}
              </div>
              
              {activeTab === "signup" && errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
              
              <Button 
                type="submit" 
                className="w-full mt-2"
                disabled={activeTab === "signup" && (!passwordsMatch || !confirmPassword)}
              >
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
