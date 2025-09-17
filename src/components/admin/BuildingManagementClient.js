'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createBuilding, updateBuilding, deleteBuilding } from '@/lib/actions/adminActions';
import { useRouter } from 'next/navigation';

export default function BuildingManagementClient({ initialBuildings = [] }) {
  const router = useRouter();
  const [buildings, setBuildings] = useState(initialBuildings);
  const [message, setMessage] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    building_address: '',
    building_name: '',
    corp_number: '',
    neighborhood: '',
    city: '',
    postal_code: '',
    year_built: '',
    num_floors: '',
    num_units: '',
    size_units: '',
    price_sqft: '',
    isEditing: false
  });
  const [editingAddress, setEditingAddress] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    
    // Create FormData object for the server action
    const formDataObj = new FormData();
    formDataObj.append('userId', 'current-user'); // This will be replaced by the server action
    formDataObj.append('name', formData.building_name);
    formDataObj.append('slug', formData.building_address.toLowerCase().replace(/\s+/g, '-'));
    formDataObj.append('address', JSON.stringify({
      address: formData.building_address,
      city: formData.city,
      postal_code: formData.postal_code,
      neighborhood: formData.neighborhood
    }));
    formDataObj.append('description', `Built in ${formData.year_built}, ${formData.num_floors} floors, ${formData.num_units} units`);
    formDataObj.append('amenities', []);
    
    if (editingAddress) {
      formDataObj.append('buildingId', buildings.find(b => b.building_address === editingAddress)?.id);
      formDataObj.append('isActive', 'true');
    }
    
    // Call the appropriate server action
    const result = editingAddress 
      ? await updateBuilding(formDataObj)
      : await createBuilding(formDataObj);
    
    if (result.error) {
      setMessage({
        type: 'error',
        text: result.error
      });
    } else if (result.success) {
      setMessage({
        type: 'success',
        text: editingAddress ? 'Building updated successfully' : 'Building created successfully'
      });
      
      // Reset form
      setFormData({
        building_address: '',
        building_name: '',
        corp_number: '',
        neighborhood: '',
        city: '',
        postal_code: '',
        year_built: '',
        num_floors: '',
        num_units: '',
        size_units: '',
        price_sqft: '',
        isEditing: false
      });
      setEditingAddress(null);
      setIsFormVisible(false); // Hide the form after successful submission
      
      // Refresh the page to get updated data
      router.refresh();
    }
  };
  
  const handleEdit = (building) => {
    setFormData({
      building_address: building.building_address,
      building_name: building.building_name || '',
      corp_number: building.corp_number || '',
      neighborhood: building.neighborhood || '',
      city: building.city || '',
      postal_code: building.postal_code || '',
      year_built: building.year_built ? building.year_built.toString() : '',
      num_floors: building.num_floors ? building.num_floors.toString() : '',
      num_units: building.num_units ? building.num_units.toString() : '',
      size_units: building.size_units || '',
      price_sqft: building.price_sqft ? building.price_sqft.toString() : '',
      isEditing: true
    });
    setEditingAddress(building.building_address);
    setIsFormVisible(true); // Show the form when editing
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleDelete = async (buildingAddress) => {
    if (!confirm(`Are you sure you want to delete the building "${buildingAddress}"? This will remove all agent assignments for this building.`)) {
      return;
    }
    
    const building = buildings.find(b => b.building_address === buildingAddress);
    if (!building?.id) {
      setMessage({
        type: 'error',
        text: 'Building not found'
      });
      return;
    }
    
    const result = await deleteBuilding(building.id, 'current-user');
    
    if (result.error) {
      setMessage({
        type: 'error',
        text: result.error
      });
    } else if (result.success) {
      setMessage({
        type: 'success',
        text: 'Building deleted successfully'
      });
      
      // Refresh the page to get updated data
      router.refresh();
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Buildings</h1>
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          Back to Dashboard
        </Link>
      </div>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
          <button 
            className="underline ml-2" 
            onClick={() => setMessage(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Building Form - Collapsible */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{editingAddress ? 'Edit Building' : 'Add New Building'}</h2>
          {/* Always visible debug button */}
          <Button 
            type="button" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            Toggle Form ({isFormVisible ? 'Currently Visible' : 'Currently Hidden'})
          </Button>
        </div>
        
        {isFormVisible && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="building_address" className="block text-sm font-medium mb-2">Building Address</label>
                <input
                  type="text"
                  id="building_address"
                  name="building_address"
                  value={formData.building_address}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                  disabled={!!editingAddress}
                />
                {editingAddress && (
                  <p className="text-sm text-gray-500 mt-1">Address cannot be changed once created</p>
                )}
              </div>
              
              <div>
                <label htmlFor="building_name" className="block text-sm font-medium mb-2">Building Name</label>
                <input
                  type="text"
                  id="building_name"
                  name="building_name"
                  value={formData.building_name}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Skyline Towers"
                />
              </div>
              
              <div>
                <label htmlFor="corp_number" className="block text-sm font-medium mb-2">Corporation Number</label>
                <input
                  type="text"
                  id="corp_number"
                  name="corp_number"
                  value={formData.corp_number}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="CORP-12345"
                />
              </div>
              
              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium mb-2">Neighborhood</label>
                <input
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              
              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium mb-2">Postal Code</label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              
              <div>
                <label htmlFor="year_built" className="block text-sm font-medium mb-2">Year Built</label>
                <input
                  type="number"
                  id="year_built"
                  name="year_built"
                  value={formData.year_built}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
              
              <div>
                <label htmlFor="num_floors" className="block text-sm font-medium mb-2">Number of Floors</label>
                <input
                  type="number"
                  id="num_floors"
                  name="num_floors"
                  value={formData.num_floors}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="30"
                />
              </div>
              
              <div>
                <label htmlFor="num_units" className="block text-sm font-medium mb-2">Number of Units</label>
                <input
                  type="number"
                  id="num_units"
                  name="num_units"
                  value={formData.num_units}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label htmlFor="size_units" className="block text-sm font-medium mb-2">Size Units</label>
                <input
                  type="text"
                  id="size_units"
                  name="size_units"
                  value={formData.size_units}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="sq.ft."
                />
              </div>
              
              <div>
                <label htmlFor="price_sqft" className="block text-sm font-medium mb-2">Price per Sq.Ft.</label>
                <input
                  type="number"
                  id="price_sqft"
                  name="price_sqft"
                  value={formData.price_sqft}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="1000"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="building_image" className="block text-sm font-medium mb-2">Building Image</label>
                <div className="flex flex-col space-y-2">
                  <input
                    type="file"
                    id="building_image"
                    name="building_image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Preview:</p>
                      <img 
                        src={imagePreview} 
                        alt="Building preview" 
                        className="max-h-48 rounded-md shadow-sm" 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingAddress ? 'Update Building' : 'Add Building'}
              </Button>
              
              {editingAddress && (
                <Button 
                  type="button" 
                  onClick={() => {
                    setEditingAddress(null); 
                    setFormData({
                      building_address: '', 
                      building_name: '',
                      corp_number: '',
                      neighborhood: '', 
                      city: '', 
                      postal_code: '', 
                      year_built: '',
                      num_floors: '',
                      num_units: '',
                      size_units: '',
                      price_sqft: '',
                      isEditing: false
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
      
      {/* Buildings List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Buildings List</h2>
          {!isFormVisible && (
            <button 
              type="button" 
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={() => setIsFormVisible(true)}
            >
              Add New Building
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Corp #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Neighborhood</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agents</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {buildings.length > 0 ? (
                buildings.map((building, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{building.building_address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{building.building_name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{building.corp_number || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{building.neighborhood || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{building.num_units || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{building.num_floors || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {building.agent_count || 0} agents
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(building)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(building.building_address)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
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
