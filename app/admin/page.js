import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Verify the user is authenticated and an admin
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
  
  // Fetch dashboard stats
  const [
    { data: agents },
    { data: users },
    { data: agentBuildings }
  ] = await Promise.all([
    supabase.from('agents').select('id'),
    supabase.from('users').select('id'),
    supabase.from('agent_buildings').select('building_address')
  ]);
  
  // Calculate unique buildings by using a Set to remove duplicates
  const uniqueBuildings = agentBuildings ? 
    new Set(agentBuildings.map(building => building.building_address)) : 
    new Set();
    
  const stats = {
    totalAgents: agents?.length || 0,
    totalUsers: users?.length || 0,
    totalBuildings: uniqueBuildings.size
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-500">Total Agents</h2>
          <p className="text-3xl font-bold">{stats.totalAgents}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-500">Total Users</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-500">Buildings</h2>
          <p className="text-3xl font-bold">{stats.totalBuildings}</p>
        </div>
      </div>
      
      {/* Admin Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/agents" className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Manage Agents</h2>
          <p className="text-gray-600">Add, edit or remove agent listings and assign buildings</p>
        </Link>
        
        <Link href="/admin/buildings" className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Manage Buildings</h2>
          <p className="text-gray-600">Add, edit or remove building listings</p>
        </Link>
        
        <Link href="/admin/users" className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p className="text-gray-600">View and manage user accounts</p>
        </Link>
      </div>
    </div>
  );
}
