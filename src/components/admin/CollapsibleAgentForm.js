'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CollapsibleAgentForm({ handleCreateAgent }) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add New Agent</h2>
        <Button 
          type="button" 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? 'Hide Form' : 'Show Form'}
        </Button>
      </div>
      
      {isFormVisible && (
        <form action={handleCreateAgent}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Agent Name</label>
              <input
                type="text"
                id="name"
                name="name"
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
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Agent
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
