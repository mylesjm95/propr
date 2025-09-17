import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getBuildings, createBuilding, deleteBuilding } from '@/lib/actions/adminActions';
import CollapsibleBuildingForm from '@/components/admin/CollapsibleBuildingForm';

export default async function ManageBuildings() {
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
  
  // Fetch buildings data using server action
  const result = await getBuildings();
  
  if (result.error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Building Management</h1>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{result.error}</p>
        </div>
      </div>
    );
  }
  
  const buildings = result.data || [];
  
  // Server action to handle form submission
  async function handleCreateBuilding(formData) {
    'use server';
    
    const result = await createBuilding(formData);
    
    if (result.error) {
      return { error: result.error };
    }
    
    revalidatePath('/admin/buildings');
    return { success: true };
  }
  
  // Server action to handle building deletion
  async function handleDeleteBuilding(formData) {
    'use server';
    
    const buildingAddress = formData.get('building_address');
    const result = await deleteBuilding(buildingAddress);
    
    if (result.error) {
      return { error: result.error };
    }
    
    revalidatePath('/admin/buildings');
    return { success: true };
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Buildings</h1>
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          Back to Dashboard
        </Link>
      </div>
      
      {/* Collapsible Building Form */}
      <CollapsibleBuildingForm handleCreateBuilding={handleCreateBuilding} />
      
      {/* Buildings List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Buildings List</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Neighborhood</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postal Code</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {buildings.length > 0 ? (
                buildings.map((building) => (
                  <tr key={building.building_address}>
                    <td className="px-6 py-4 whitespace-nowrap">{building.building_address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{building.neighborhood || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{building.city || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{building.postal_code || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/buildings/edit/${encodeURIComponent(building.building_address)}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <form action={handleDeleteBuilding}>
                          <input type="hidden" name="building_address" value={building.building_address} />
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-900"
                            onClick={(e) => {
                              if (!confirm('Are you sure you want to delete this building? This will also remove all agent assignments.')) {
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
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No buildings found. Add your first building above.
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
