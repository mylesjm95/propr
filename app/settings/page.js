import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import ProfileForm from '@/components/settings/ProfileForm';
import SecuritySettings from '@/components/settings/SecuritySettings';
import SessionsTable from '@/components/settings/SessionsTable';
import SavedSearches from '@/components/settings/SavedSearches';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Settings() {
  // Get user session from server-side
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // If no user is logged in, redirect to home page
  if (!user) {
    redirect('/');
  }

  // Fetch the user's profile information
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  // Fetch the user's saved searches
  const { data: userData } = await supabase
    .from('users')
    .select('saved_searches')
    .eq('id', user.id)
    .single();

  // Get the authenticated user and session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Use getUser() which authenticates with the Supabase Auth server for security
  const { data: authData } = await supabase.auth.getUser();
  // Use the authenticated user data instead of session.user
  const authenticatedUser = authData.user;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="saved-searches">Saved Searches</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-8">
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              <ProfileForm user={authenticatedUser} profile={profile} />
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-8">
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
              <SecuritySettings user={authenticatedUser} />
            </div>
          </TabsContent>
          
          <TabsContent value="sessions" className="space-y-8">
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Current Session</h2>
              <SessionsTable session={session} user={authenticatedUser} />
            </div>
          </TabsContent>

          <TabsContent value="saved-searches" className="space-y-8">
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Building Alerts</h2>
              <SavedSearches user={authenticatedUser} savedSearches={userData?.saved_searches || []} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
