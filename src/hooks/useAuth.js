'use client';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);
  const [supabaseClient, setSupabaseClient] = useState(null);

  useEffect(() => {
    // Only run this effect on the client
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    setIsClient(true);
    
    const initializeAuth = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { createBrowserClient } = await import("@supabase/ssr");
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          console.error('Missing Supabase environment variables');
          setLoading(false);
          return;
        }

        const supabase = createBrowserClient(supabaseUrl, supabaseKey);
        setSupabaseClient(supabase);
        
        // Get initial user and user role
        const getSession = async () => {
          try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            // Handle auth session missing error gracefully
            if (error && error.message === 'Auth session missing!') {
              // This is normal when user is not logged in
              setUser(null);
              setUserRole(null);
              setLoading(false);
              return;
            }
            
            if (error) {
              console.error('Error getting user:', error);
              setUser(null);
              setUserRole(null);
              setLoading(false);
              return;
            }
            
            setUser(user);
            
            // If user is logged in, check if they have admin role
            if (user) {
              // Check if user has admin role in their metadata
              const userRole = user.user_metadata?.role || 
                              (user.email === 'mylesjm95@gmail.com' ? 'admin' : 'user');
              setUserRole(userRole);
            } else {
              setUserRole(null);
            }
            
            setLoading(false);
          } catch (error) {
            // Handle auth session missing error gracefully
            if (error.message === 'Auth session missing!') {
              setUser(null);
              setUserRole(null);
              setLoading(false);
              return;
            }
            
            console.error('Error getting user:', error);
            setError(error);
            setUser(null);
            setUserRole(null);
            setLoading(false);
          }
        };

        await getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change event:', event, 'session:', session); // Debug log
            
            // Handle SIGNED_OUT event immediately
            if (event === 'SIGNED_OUT') {
              console.log('User signed out, clearing auth state'); // Debug log
              setUser(null);
              setUserRole(null);
              setLoading(false);
              return;
            }
            
            try {
              // Use getUser() for more secure authentication
              const { data: { user }, error } = await supabase.auth.getUser();
              
              // Handle auth session missing error gracefully
              if (error && error.message === 'Auth session missing!') {
                // This is normal when user is not logged in
                setUser(null);
                setUserRole(null);
                setLoading(false);
                return;
              }
              
              if (error) {
                console.error('Error getting user in auth change:', error);
                setUser(null);
                setUserRole(null);
                setLoading(false);
                return;
              }
              
              console.log('Setting user to:', user); // Debug log
              setUser(user);
              
              // If user is logged in, check if they have admin role
              if (user) {
                // Check if user has admin role in their metadata
                const userRole = user.user_metadata?.role || 
                                (user.email === 'mylesjm95@gmail.com' ? 'admin' : 'user');
                console.log('Setting userRole to:', userRole); // Debug log
                setUserRole(userRole);
              } else {
                console.log('Setting userRole to null'); // Debug log
                setUserRole(null);
              }
              
              setLoading(false);
            } catch (error) {
              // Handle auth session missing error gracefully
              if (error.message === 'Auth session missing!') {
                setUser(null);
                setUserRole(null);
                setLoading(false);
                return;
              }
              
              console.error('Error in auth state change:', error);
              setUser(null);
              setUserRole(null);
              setLoading(false);
            }
          }
        );

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing Supabase client:', error);
        setError(error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const refreshAuth = async () => {
    if (supabaseClient) {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error refreshing auth:', error);
        setError(error);
        setUser(null);
        setLoading(false);
      }
    }
  };

  return { 
    user, 
    userRole,
    loading: loading || !isClient, 
    isAuthenticated: !!user,
    error,
    refreshAuth
  };
} 