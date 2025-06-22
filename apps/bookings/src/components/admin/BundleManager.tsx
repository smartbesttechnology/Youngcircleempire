
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Edit } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Bundle = Tables<'bundles'>;

const BundleManager = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [services, setServices] = useState<Tables<'services'>[]>([]);
  const [addons, setAddons] = useState<Tables<'addons'>[]>([]);
  const [equipment, setEquipment] = useState<Tables<'equipment'>[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    services: [] as string[],
    addons: [] as string[],
    equipment: [] as string[],
    discount_percentage: 0,
    total_price: 0,
    enabled: true
  });

  useEffect(() => {
    fetchBundles();
    fetchServices();
    fetchAddons();
    fetchEquipment();
  }, []);

  const fetchBundles = async () => {
    try {
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBundles(data || []);
    } catch (error) {
      console.error('Error fetching bundles:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('enabled', true);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchAddons = async () => {
    try {
      const { data, error } = await supabase
        .from('addons')
        .select('*')
        .eq('enabled', true);

      if (error) throw error;
      setAddons(data || []);
    } catch (error) {
      console.error('Error fetching addons:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('enabled', true);

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bundleData = {
        ...formData,
        services: formData.services,
        addons: formData.addons,
        equipment: formData.equipment
      };

      if (editingBundle) {
        const { error } = await supabase
          .from('bundles')
          .update(bundleData)
          .eq('id', editingBundle.id);

        if (error) throw error;
        toast({ title: "Bundle updated successfully" });
      } else {
        const { error } = await supabase
          .from('bundles')
          .insert([bundleData]);

        if (error) throw error;
        toast({ title: "Bundle created successfully" });
      }

      resetForm();
      fetchBundles();
    } catch (error) {
      console.error('Error saving bundle:', error);
      toast({
        title: "Error saving bundle",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bundles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Bundle deleted successfully" });
      fetchBundles();
    } catch (error) {
      console.error('Error deleting bundle:', error);
      toast({
        title: "Error deleting bundle",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      services: [],
      addons: [],
      equipment: [],
      discount_percentage: 0,
      total_price: 0,
      enabled: true
    });
    setEditingBundle(null);
    setShowForm(false);
  };

  const startEdit = (bundle: Bundle) => {
    // Helper function to safely convert Json to string array
    const jsonToStringArray = (json: unknown): string[] => {
      if (Array.isArray(json)) {
        return json.map(item => typeof item === 'string' ? item : String(item));
      }
      return [];
    };

    setFormData({
      name: bundle.name,
      description: bundle.description || '',
      services: jsonToStringArray(bundle.services),
      addons: jsonToStringArray(bundle.addons),
      equipment: jsonToStringArray(bundle.equipment),
      discount_percentage: bundle.discount_percentage || 0,
      total_price: bundle.total_price || 0,
      enabled: bundle.enabled ?? true
    });
    setEditingBundle(bundle);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Bundle Packages</CardTitle>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {showForm ? 'Cancel' : 'Create Bundle'}
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-gray-800 rounded">
              <div className="space-y-2">
                <Label className="text-white">Bundle Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Discount %</Label>
                  <Input
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Total Price</Label>
                  <Input
                    type="number"
                    value={formData.total_price}
                    onChange={(e) => setFormData({ ...formData, total_price: Number(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
                <Label className="text-white">Enabled</Label>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {editingBundle ? 'Update Bundle' : 'Create Bundle'}
              </Button>
            </form>
          )}

          <div className="space-y-4">
            {bundles.map((bundle) => (
              <div key={bundle.id} className="p-4 bg-gray-800 rounded flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium">{bundle.name}</h3>
                  <p className="text-gray-400 text-sm">{bundle.description}</p>
                  <p className="text-teal-400">
                    {bundle.discount_percentage}% off - ₦{bundle.total_price}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(bundle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(bundle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BundleManager;
