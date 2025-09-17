'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building, User, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AgentAssignmentModal({ building, agents, onAssign, onUnassign }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState([]);

  // Initialize selected agents based on current assignments
  useEffect(() => {
    if (building && building.assignedAgents) {
      setSelectedAgents(building.assignedAgents.map(agent => agent.id));
    }
  }, [building]);

  const handleAgentToggle = (agentId) => {
    setSelectedAgents(prev => 
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleSave = () => {
    if (building && onAssign) {
      const agentsToAssign = agents.filter(agent => selectedAgents.includes(agent.id));
      onAssign(building.id, agentsToAssign);
    }
    setIsOpen(false);
  };

  const handleUnassign = (agentId) => {
    if (onUnassign) {
      onUnassign(building.id, agentId);
    }
  };

  if (!building) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Assign Agents
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Assign Agents to {building.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Assignments */}
          {building.assignedAgents && building.assignedAgents.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Currently Assigned</h4>
              <div className="space-y-2">
                {building.assignedAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={agent.photo} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{agent.name}</div>
                        <div className="text-xs text-gray-500">{agent.email}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnassign(agent.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Agents */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Available Agents</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {agents
                .filter(agent => agent.isActive)
                .map((agent) => (
                  <div key={agent.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={`agent-${agent.id}`}
                      checked={selectedAgents.includes(agent.id)}
                      onCheckedChange={() => handleAgentToggle(agent.id)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={agent.photo} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                      <div className="text-xs text-gray-500">{agent.email}</div>
                      <div className="text-xs text-gray-500">{agent.phone}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {agent.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded"
                          >
                            {specialty}
                          </span>
                        ))}
                        {agent.specialties.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{agent.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Assignments
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
