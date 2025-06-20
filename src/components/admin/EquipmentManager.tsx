
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  depositRequired: boolean;
  depositAmount: number;
  dailyRate: number;
  enabled: boolean;
  description: string;
}

const EquipmentManager = () => {
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: "1", name: "Sony Alpha A1", depositRequired: true, depositAmount: 500000, dailyRate: 50000, enabled: true, description: "Professional mirrorless camera" },
    { id: "2", name: "Professional Gimbal", depositRequired: true, depositAmount: 200000, dailyRate: 20000, enabled: true, description: "3-axis camera stabilizer" },
    { id: "3", name: "LED Light Kit", depositRequired: true, depositAmount: 150000, dailyRate: 25000, enabled: true, description: "Professional lighting equipment" }
  ]);
  
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment({ ...equipment });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingEquipment({
      id: "",
      name: "",
      depositRequired: false,
      depositAmount: 0,
      dailyRate: 0,
      enabled: true,
      description: ""
    });
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!editingEquipment) return;

    if (isCreating) {
      const newEquipment = {
        ...editingEquipment,
        id: Date.now().toString()
      };
      setEquipment(prev => [...prev, newEquipment]);
      toast({ title: "Equipment created successfully" });
    } else {
      setEquipment(prev => prev.map(e => e.id === editingEquipment.id ? editingEquipment : e));
      toast({ title: "Equipment updated successfully" });
    }

    setEditingEquipment(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    setEquipment(prev => prev.filter(e => e.id !== id));
    toast({ title: "Equipment deleted successfully" });
  };

  const toggleEnabled = (id: string) => {
    setEquipment(prev => prev.map(e => 
      e.id === id ? { ...e, enabled: !e.enabled } : e
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
        <h2 className="text-2xl font-bold text-white">Equipment Management</h2>
        <Button onClick={handleCreate} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Equipment List */}
      <Card className="bg-slate-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Rental Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {equipment.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <Switch
                      checked={item.enabled}
                      onCheckedChange={() => toggleEnabled(item.id)}
                    />
                    {!item.enabled && (
                      <span className="text-red-400 text-sm">Disabled</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                  <div className="flex space-x-4 mt-2">
                    <p className="text-teal-400 text-sm">Daily: {formatPrice(item.dailyRate)}</p>
                    {item.depositRequired && (
                      <p className="text-orange-400 text-sm">Deposit: {formatPrice(item.depositAmount)}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(item)}
                    size="sm"
                    variant="outline"
                    className="border-gray-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
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

      {/* Edit/Create Modal */}
      {editingEquipment && (
        <Card className="bg-slate-900 border-teal-500">
          <CardHeader>
            <CardTitle className="text-white">
              {isCreating ? "Add New Equipment" : "Edit Equipment"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">Equipment Name</Label>
              <Input
                id="name"
                value={editingEquipment.name}
                onChange={(e) => setEditingEquipment(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="dailyRate" className="text-white">Daily Rate (₦)</Label>
              <Input
                id="dailyRate"
                type="number"
                value={editingEquipment.dailyRate}
                onChange={(e) => setEditingEquipment(prev => prev ? { ...prev, dailyRate: Number(e.target.value) } : null)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={editingEquipment.depositRequired}
                onCheckedChange={(checked) => setEditingEquipment(prev => prev ? { ...prev, depositRequired: checked } : null)}
              />
              <Label className="text-white">Deposit Required</Label>
            </div>

            {editingEquipment.depositRequired && (
              <div>
                <Label htmlFor="depositAmount" className="text-white">Deposit Amount (₦)</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  value={editingEquipment.depositAmount}
                  onChange={(e) => setEditingEquipment(prev => prev ? { ...prev, depositAmount: Number(e.target.value) } : null)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            )}

            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={editingEquipment.description}
                onChange={(e) => setEditingEquipment(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={editingEquipment.enabled}
                onCheckedChange={(checked) => setEditingEquipment(prev => prev ? { ...prev, enabled: checked } : null)}
              />
              <Label className="text-white">Equipment Enabled</Label>
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
                  setEditingEquipment(null);
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

export default EquipmentManager;
