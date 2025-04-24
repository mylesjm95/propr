import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAgents, createAgent, updateAgent, deleteAgent } from '@/lib/actions/admin';
import CollapsibleAgentForm from '@/components/admin/CollapsibleAgentForm';

export default async function ManageAgents() {
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
  
  // Fetch agents data using server action
  const result = await getAgents();
  
  if (result.error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Agent Management</h1>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{result.error}</p>
        </div>
      </div>
    );
  }
  
  const agents = result.data || [];
  
  // Server action to handle form submission
  async function handleCreateAgent(formData) {
    'use server';
    
    const result = await createAgent(formData);
    
    if (result.error) {
      return { error: result.error };
    }
    
    revalidatePath('/admin/agents');
    return { success: true };
  }
  
  // Server action to handle agent update
  async function handleUpdateAgent(formData) {
    'use server';
    
    const agentId = formData.get('id');
    const result = await updateAgent(agentId, formData);
    
    if (result.error) {
      return { error: result.error };
    }
    
    revalidatePath('/admin/agents');
    return { success: true };
  }
  
  // Server action to handle agent deletion
  async function handleDeleteAgent(formData) {
    'use server';
    
    const agentId = formData.get('id');
    const result = await deleteAgent(agentId);
    
    if (result.error) {
      return { error: result.error };
    }
    
    revalidatePath('/admin/agents');
    return { success: true };
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Agents</h1>
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          Back to Dashboard
        </Link>
      </div>
      
      {/* Collapsible Agent Form */}
      <CollapsibleAgentForm handleCreateAgent={handleCreateAgent} />
      
      {/* Agents List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Agents List</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buildings</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.company || '-'}</td>
                    <td className="px-6 py-4">
                      {agent.agent_buildings && agent.agent_buildings.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {agent.agent_buildings.length} buildings
                          </span>
                          <Link href={`/admin/agents/${agent.id}/buildings`} className="text-sm text-blue-600 hover:underline ml-2">
                            Manage
                          </Link>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">No buildings</span>
                          <Link href={`/admin/agents/${agent.id}/buildings`} className="text-sm text-blue-600 hover:underline ml-2">
                            Assign
                          </Link>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/agents/edit/${agent.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <form action={handleDeleteAgent}>
                          <input type="hidden" name="id" value={agent.id} />
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-900"
                            onClick={(e) => {
                              if (!confirm('Are you sure you want to delete this agent? This will also remove all building assignments.')) {
                                e.preventDefault();
                              }
                            }}
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No agents found. Add your first agent above.
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
