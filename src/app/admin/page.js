import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTable from '@/components/admin/UserTable';
import AgentTable from '@/components/admin/AgentTable';
import BuildingTable from '@/components/admin/BuildingTable';

export default async function AdminPage() {
  // Get user session from server-side
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // If no user is logged in, redirect to home page
  if (!user) {
    redirect('/');
  }

  // Check if user is admin by email (same logic as useAuth hook)
  const isAdmin = user.email === 'mylesjm95@gmail.com' || user.user_metadata?.role === 'admin';
    
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Welcome to the admin panel, {user.email}!</p>
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="buildings">Buildings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-8">
            <div className="bg-card rounded-lg shadow p-6">
              <UserTable />
            </div>
          </TabsContent>
          
          <TabsContent value="agents" className="space-y-8">
            <div className="bg-card rounded-lg shadow p-6">
              <AgentTable />
            </div>
          </TabsContent>
          
          <TabsContent value="buildings" className="space-y-8">
            <div className="bg-card rounded-lg shadow p-6">
              <BuildingTable />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
