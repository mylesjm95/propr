'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Edit, Trash2, Building, Upload, X, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getBuildings, createBuilding, updateBuilding, deleteBuilding } from '@/lib/actions/buildingActions';
import { toast } from 'sonner';

export default function BuildingTable() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    address: '',
    description: '',
    amenities: [],
    photos: []
  });
  const [newAmenity, setNewAmenity] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  // Load buildings from database
  useEffect(() => {
    const loadBuildings = async () => {
      try {
        const result = await getBuildings();
        if (result.success) {
          setBuildings(result.buildings);
        } else {
          toast.error('Failed to load buildings: ' + result.error);
        }
      } catch (error) {
        toast.error('Error loading buildings: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadBuildings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        const formDataObj = new FormData();
        formDataObj.append('name', formData.name);
        formDataObj.append('slug', formData.slug);
        formDataObj.append('address', formData.address);
        formDataObj.append('description', formData.description);
        formDataObj.append('amenities', formData.amenities.join(','));
        formDataObj.append('photos', [...formData.photos, ...uploadedPhotos].join(','));
        
        let result;
        if (editingBuilding) {
          formDataObj.append('id', editingBuilding.id);
          result = await updateBuilding(formDataObj);
        } else {
          result = await createBuilding(formDataObj);
        }
        
        if (result.success) {
          toast.success(editingBuilding ? 'Building updated successfully' : 'Building created successfully');
          // Reload buildings
          const buildingsResult = await getBuildings();
          if (buildingsResult.success) {
            setBuildings(buildingsResult.buildings);
          }
          resetForm();
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error('Error saving building: ' + error.message);
      }
    });
  };

  const handleEdit = (building) => {
    setEditingBuilding(building);
    setFormData({
      name: building.name,
      slug: building.slug,
      address: typeof building.address === 'object' ? building.address.street : building.address,
      description: building.description || '',
      amenities: building.amenities || [],
      photos: building.photos || []
    });
    setUploadedPhotos([]);
    setIsModalOpen(true);
  };

  const handleDelete = (buildingId) => {
    if (confirm('Are you sure you want to delete this building?')) {
      startTransition(async () => {
        try {
          const result = await deleteBuilding(buildingId);
          if (result.success) {
            toast.success('Building deleted successfully');
            // Reload buildings
            const buildingsResult = await getBuildings();
            if (buildingsResult.success) {
              setBuildings(buildingsResult.buildings);
            }
          } else {
            toast.error(result.error);
          }
        } catch (error) {
          toast.error('Error deleting building: ' + error.message);
        }
      });
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      slug: '', 
      address: '', 
      description: '', 
      amenities: [], 
      photos: [] 
    });
    setNewAmenity('');
    setUploadedPhotos([]);
    setEditingBuilding(null);
    setIsModalOpen(false);
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index)
    });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Buildings ({buildings.length})</h3>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Building
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBuilding ? 'Edit Building' : 'Add New Building'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Building Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (!editingBuilding) {
                        setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                      }
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={typeof formData.address === 'object' ? formData.address.street : formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add amenity"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" onClick={addAmenity}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Photos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">Click to upload photos</span>
                  </label>
                </div>
                {(formData.photos.length > 0 || uploadedPhotos.length > 0) && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {[...formData.photos, ...uploadedPhotos].map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Building photo ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingBuilding ? 'Update' : 'Create'} Building
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amenities
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {buildings.map((building) => (
                <tr key={building.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={building.photos[0]} />
                        <AvatarFallback>
                          <Building className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{building.name}</div>
                        <div className="text-sm text-gray-500">/{building.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof building.address === 'object' ? building.address.street : building.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {building.amenities.slice(0, 2).map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                      {building.amenities.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{building.amenities.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {building.photos.length} photo(s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(building)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(building.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
