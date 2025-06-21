
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  enabled: boolean;
  description: string;
}

const ServicesManager = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([
    { id: "1", name: "Music Recording", category: "Studio Sessions", price: 50000, enabled: true, description: "Professional music recording session" },
    { id: "2", name: "Music Video", category: "Visuals & Shoots", price: 150000, enabled: true, description: "Complete music video production" },
    { id: "3", name: "Empire Platinum Package", category: "Premium Artist Packages", price: 300000, enabled: true, description: "Our premium all-inclusive package" }
  ]);
  
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const categories = [
    "Studio Sessions",
    "Visuals & Shoots", 
    "Premium Artist Packages"
  ];

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingService({
      id: "",
      name: "",
      category: categories[0],
      price: 0,
      enabled: true,
      description: ""
    });
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!editingService) return;

    if (isCreating) {
      const newService = {
        ...editingService,
        id: Date.now().toString()
      };
      setServices(prev => [...prev, newService]);
      toast({ title: "Service created successfully" });
    } else {
      setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
      toast({ title: "Service updated successfully" });
    }

    setEditingService(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    toast({ title: "Service deleted successfully" });
  };

  const toggleEnabled = (id: string) => {
    setServices(prev => prev.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Services Management</h2>
        <Button onClick={handleCreate} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services List */}
      <div className="grid gap-4">
        {categories.map(category => (
          <Card key={category} className="bg-slate-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {services.filter(s => s.category === category).map(service => (
                  <div key={service.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-white font-medium">{service.name}</h3>
                        <Switch
                          checked={service.enabled}
                          onCheckedChange={() => toggleEnabled(service.id)}
                        />
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{service.description}</p>
                      <p className="text-teal-400 text-sm">{formatPrice(service.price)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(service)}
                        size="sm"
                        variant="outline"
                        className="border-gray-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(service.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {editingService && (
        <Card className="bg-slate-900 border-teal-500">
          <CardHeader>
            <CardTitle className="text-white">
              {isCreating ? "Create New Service" : "Edit Service"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">Service Name</Label>
              <Input
                id="name"
                value={editingService.name}
                onChange={(e) => setEditingService(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-white">Category</Label>
              <Select
                value={editingService.category}
                onValueChange={(value) => setEditingService(prev => prev ? { ...prev, category: value } : null)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price" className="text-white">Price (₦)</Label>
              <Input
                id="price"
                type="number"
                value={editingService.price}
                onChange={(e) => setEditingService(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={editingService.description}
                onChange={(e) => setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={editingService.enabled}
                onCheckedChange={(checked) => setEditingService(prev => prev ? { ...prev, enabled: checked } : null)}
              />
              <Label className="text-white">Service Enabled</Label>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleSave}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isCreating ? "Create" : "Save Changes"}
              </Button>
              <Button
                onClick={() => {
                  setEditingService(null);
                  setIsCreating(false);
                }}
                variant="outline"
                className="border-gray-600 text-white"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServicesManager;
