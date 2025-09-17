'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toggleUserRole } from '@/lib/actions/adminActions';

export default function UserManagementClient({ initialUsers = [] }) {
  const [users, setUsers] = useState(initialUsers);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleUserRole = async (userId, currentRole) => {
    setIsLoading(true);
    try {
      const result = await toggleUserRole(userId, currentRole);
      
      if (result.error) {
        setMessage({
          type: 'error',
          text: result.error
        });
      } else if (result.success) {
        setMessage({
          type: 'success',
          text: result.message
        });
        
        // Update the local state with the new role
        setUsers(users.map(user => {
          if (user.id === userId) {
            return { ...user, role: result.newRole };
          }
          return user;
        }));
      }
    } catch (error) {
      console.error('Error toggling user role:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update user role. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      {message && (
        <div 
          className={`border-l-4 p-4 mb-4 ${
            message.type === 'success' 
              ? 'bg-green-100 border-green-500 text-green-700' 
              : 'bg-red-100 border-red-500 text-red-700'
          }`} 
          role="alert"
        >
          <p>{message.text}</p>
          <button 
            className="underline ml-2" 
            onClick={() => setMessage(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Role</th>
              <th className="py-2 px-4 border-b text-left">Created</th>
              <th className="py-2 px-4 border-b text-left">Last Sign In</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.email || 'N/A'}</td>
                <td className="py-2 px-4 border-b">
                  {user.full_name || 'Not set'}
                </td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  {user.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString() 
                    : 'N/A'}
                </td>
                <td className="py-2 px-4 border-b">
                  {user.lastSignIn 
                    ? new Date(user.lastSignIn).toLocaleDateString() 
                    : 'N/A'}
                </td>
                <td className="py-2 px-4 border-b">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    disabled={isLoading}
                    onClick={() => handleToggleUserRole(user.id, user.role)}
                  >
                    {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                  </Button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
