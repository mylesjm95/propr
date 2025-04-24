import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAgentBuildings, assignBuildingToAgent, removeBuildingAssignment } from '@/lib/actions/admin';

export default async function AgentBuildings({ params }) {
  const agentId = params.agentId;
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
  
  // Fetch agent details
  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single();
  
  if (agentError || !agent) {
    redirect('/admin/agents');
  }
  
  // Fetch assigned buildings
  const result = await getAgentBuildings(agentId);
  
  if (result.error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Manage Agent Buildings</h1>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{result.error}</p>
        </div>
      </div>
    );
  }
  
  const assignedBuildings = result.data || [];
  
  // Server action to handle building assignment
  async function handleAssignBuilding(formData) {
    'use server';
    
    const result = await assignBuildingToAgent(agentId, formData);
    
    revalidatePath(`/admin/agents/${agentId}/buildings`);
    return result;
  }
  
  // Server action to handle building removal
  async function handleRemoveBuilding(formData) {
    'use server';
    
    const assignmentId = formData.get('assignmentId');
    const result = await removeBuildingAssignment(assignmentId);
    
    revalidatePath(`/admin/agents/${agentId}/buildings`);
    return result;
  }
  
  // Server action to search buildings
  async function searchBuildings(formData) {
    'use server';
    
    const searchTerm = formData.get('searchTerm');
    
    if (!searchTerm || !searchTerm.trim()) {
      return { data: [] };
    }
    
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('agent_buildings')
        .select('DISTINCT building_address')
        .ilike('building_address', `%${searchTerm}%`)
        .limit(10);
        
      if (error) throw error;
      
      return { data: data || [] };
    } catch (error) {
      console.error('Error searching buildings:', error);
      return { error: 'Error searching buildings' };
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Buildings for Agent</h1>
          <p className="text-gray-600 text-lg">{agent.name}</p>
        </div>
        <Link href="/admin/agents" className="text-blue-600 hover:text-blue-800">
          Back to Agents
        </Link>
      </div>
      
      {/* Add Building Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Assign Building to {agent.name}</h2>
        <form action={handleAssignBuilding}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="building_address" className="block text-sm font-medium mb-2">Building Address</label>
              <input
                type="text"
                id="building_address"
                name="building_address"
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="e.g. 123 Main Street"
                required
              />
            </div>
            <div className="self-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 h-12">
                Assign Building
              </Button>
            </div>
          </div>
        </form>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Search Existing Buildings</h3>
          <form action={searchBuildings}>
            <div className="flex gap-2">
              <input
                type="text"
                name="searchTerm"
                className="flex-grow p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Search buildings..."
              />
              <Button type="submit" className="bg-gray-600 hover:bg-gray-700">
                Search
              </Button>
            </div>
          </form>
          
          {/* Note: Search results will be displayed in a new page or with client-side JS */}
        </div>
      </div>
      
      {/* Assigned Buildings List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Assigned Buildings</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Assigned</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignedBuildings.length > 0 ? (
                assignedBuildings.map((building) => (
                  <tr key={building.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{building.building_address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(building.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <form action={handleRemoveBuilding}>
                        <input type="hidden" name="assignmentId" value={building.id} />
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-900"
                          onClick={(e) => {
                            if (!confirm('Are you sure you want to remove this building assignment?')) {
                              e.preventDefault();
                            }
                          }}
                        >
                          Remove
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No buildings assigned to this agent yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
