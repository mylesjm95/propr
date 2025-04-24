'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CollapsibleBuildingForm({ handleCreateBuilding }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
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

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add New Building</h2>
        <Button 
          type="button" 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? 'Hide Form' : 'Show Form'}
        </Button>
      </div>
      
      {isFormVisible && (
        <form action={handleCreateBuilding}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="building_address" className="block text-sm font-medium mb-2">Building Address*</label>
              <input
                type="text"
                id="building_address"
                name="building_address"
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                required
                placeholder="123 Main St"
              />
            </div>
            
            <div>
              <label htmlFor="building_name" className="block text-sm font-medium mb-2">Building Name</label>
              <input
                type="text"
                id="building_name"
                name="building_name"
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
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Downtown"
              />
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                id="city"
                name="city"
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="New York"
              />
            </div>
            
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium mb-2">Postal Code</label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="10001"
              />
            </div>
            
            <div>
              <label htmlFor="year_built" className="block text-sm font-medium mb-2">Year Built</label>
              <input
                type="number"
                id="year_built"
                name="year_built"
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="2000"
              />
            </div>
            
            <div>
              <label htmlFor="num_floors" className="block text-sm font-medium mb-2">Number of Floors</label>
              <input
                type="number"
                id="num_floors"
                name="num_floors"
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
          
          <div className="mt-6">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Building
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
