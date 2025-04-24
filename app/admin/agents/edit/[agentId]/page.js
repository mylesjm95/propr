import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { updateAgent } from '@/lib/actions/admin';

export default async function EditAgent({ params }) {
  const { agentId } = params;
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
  
  // Fetch agent data
  const { data: agent, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single();
    
  if (error || !agent) {
    redirect('/admin/agents');
  }
  
  // Server action to handle form submission
  async function handleUpdateAgent(formData) {
    'use server';
    
    const result = await updateAgent(agentId, formData);
    
    if (result.error) {
      return { error: result.error };
    }
    
    revalidatePath('/admin/agents');
    redirect('/admin/agents');
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Agent</h1>
        <Link href="/admin/agents" className="text-blue-600 hover:text-blue-800">
          Back to Agents
        </Link>
      </div>
      
      {/* Edit Agent Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Edit {agent.name}</h2>
        <form action={handleUpdateAgent}>
          <input type="hidden" name="id" value={agentId} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Agent Name</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={agent.name}
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={agent.email}
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={agent.phone || ''}
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                defaultValue={agent.company || ''}
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Update Agent
            </Button>
            
            <Link href="/admin/agents">
              <Button type="button" className="bg-gray-500 hover:bg-gray-600">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
