import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import UserManagementClient from '@/components/admin/UserManagementClient';
import { getUsers } from '@/lib/actions/adminActions';

export default async function ManageUsers() {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin on the server
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/');
  }
  
  // Check if user has admin role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (!userData || userData.role !== 'admin') {
    redirect('/');
  }
  
  // Fetch users data using server action
  const result = await getUsers();
  
  if (result.error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{result.error}</p>
        </div>
      </div>
    );
  }
  
  const users = result.data || [];
  
  // Pass the users data to the client component for interactive features
  return (
    <>
      <UserManagementClient initialUsers={users} />
    </>
  );
}
