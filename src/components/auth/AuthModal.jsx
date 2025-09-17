"use client";

import { useState } from "react";
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
import { createBrowserClient } from "@supabase/ssr";
import { subscribeToBuildingUpdates } from "@/lib/actions/subscriptionActions";
import { toast } from "sonner";

export function AuthModal({ isOpen, onOpenChange, defaultTab = "login", buildingAddress = null }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Create Supabase client
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    if (activeTab === "signup") {
      if (password !== confirmPassword) {
        setPasswordsMatch(false);
        return;
      }
      const formData = new FormData(e.target);
      const name = formData.get("name");
      const email = formData.get("email");
      const passwordVal = formData.get("password");
      
      try {
        console.log('Registering user:', { name, email });
        const { data, error } = await supabase.auth.signUp({
          email,
          password: passwordVal,
          options: {
            data: {
              name: name,
            }
          }
        });
        
        if (error) {
          setErrorMessage(error.message);
        } else {
          console.log('Registration successful:', data);
          
          // If there's a building address, automatically subscribe the user
          if (buildingAddress && data.user) {
            setIsSubscribing(true);
            try {
              const formData = new FormData();
              formData.append('buildingAddress', buildingAddress);
              
              const subscriptionResult = await subscribeToBuildingUpdates(formData);
              
              if (subscriptionResult.success) {
                toast.success('Account created and subscribed!', {
                  description: `You'll receive updates about ${decodeURIComponent(buildingAddress)}`
                });
              } else {
                toast.success('Account created successfully!', {
                  description: 'You can subscribe to building updates from the building page.'
                });
              }
            } catch (subscriptionError) {
              console.error('Error subscribing after signup:', subscriptionError);
              toast.success('Account created successfully!', {
                description: 'You can subscribe to building updates from the building page.'
              });
            } finally {
              setIsSubscribing(false);
            }
          } else {
            toast.success('Account created successfully!', {
              description: 'You can now log in to access your account.'
            });
          }
          
          onOpenChange(false); // Close modal on success
        }
      } catch (error) {
        setErrorMessage("An unexpected error occurred. Please try again.");
        console.error('Registration error:', error);
      }
      return;
    }

    // Login
    if (activeTab === "login") {
      const formData = new FormData(e.target);
      const email = formData.get("email");
      const passwordVal = formData.get("password");
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: passwordVal,
        });
        
        if (error) {
          setErrorMessage(error.message);
        } else {
          console.log('Login successful:', data);
          onOpenChange(false); // Close modal on success
        }
      } catch (error) {
        setErrorMessage("An unexpected error occurred. Please try again.");
        console.error('Login error:', error);
      }
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
              
              {/* Building subscription message for signup */}
              {activeTab === "signup" && buildingAddress && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-sm">
                      <p className="text-blue-800 font-medium">Automatic Subscription</p>
                      <p className="text-blue-700">
                        By creating an account, you'll automatically be subscribed to receive updates about <strong>{decodeURIComponent(buildingAddress)}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={activeTab === "signup" && (!passwordsMatch || !confirmPassword || isSubscribing)}
              >
                {isSubscribing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
