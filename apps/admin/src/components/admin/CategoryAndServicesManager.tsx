import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";

interface Category {
  id: string;
  name: string;
  emoji: string;
  title: string;
  tagline: string;
  description: string;
  displayOrder: number;
  enabled: boolean;
}

interface Service {
  id: string;
  name: string;
  categoryId: string;
  category: string;
  tagline: string;
  price: number;
  enabled: boolean;
  description: string;
  allowAddons: boolean;
}

const CategoryAndServicesManager = () => {
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([
    {
      id: "empire-studio-session",
      name: "empire-studio-session",
      emoji: "🎙️",
      title: "Empire Studio Session",
      tagline: "Professional recording | Creative direction | Artist-focused",
      description:
        "High-end vocal recording for independent artists seeking commercial-quality sound with professional engineer guidance.",
      displayOrder: 1,
      enabled: true,
    },
    {
      id: "empire-video-visual",
      name: "empire-video-visual",
      emoji: "🎬",
      title: "Empire Video & Visual Production",
      tagline: "Cinematic quality | Creative direction | Social-ready",
      description:
        "Concept videos, storytelling from ideation through professional-quality output including lighting, camera work, and editing direction.",
      displayOrder: 2,
      enabled: true,
    },
    {
      id: "empire-photoshoot",
      name: "empire-photoshoot",
      emoji: "📸",
      title: "Empire Photoshoot",
      tagline: "Magazine-ready | Styled shoots | Brand imagery",
      description:
        "High-level photography for artists, creatives, and brands with professional styling and art direction for your visual identity.",
      displayOrder: 3,
      enabled: true,
    },
    {
      id: "empire-events-entertainment",
      name: "empire-events-entertainment",
      emoji: "🎭",
      title: "Empire Events & Entertainment",
      tagline: "Live experiences | Industry networking | Custom coverage",
      description:
        "Event planning, hosting, and professional coverage from intimate listening parties to full showcase events with complete professional coverage.",
      displayOrder: 4,
      enabled: true,
    },
    {
      id: "promotion-distribution",
      name: "promotion-distribution",
      emoji: "📢",
      title: "Promotion & Distribution",
      tagline: "Global reach | Playlist placement | Industry connections",
      description:
        "Comprehensive music marketing from DSP distribution to PR campaigns, playlist marketing and sync licensing to build your streaming presence.",
      displayOrder: 5,
      enabled: true,
    },
    {
      id: "premium-artist-branding",
      name: "premium-artist-branding",
      emoji: "🎨",
      title: "Premium Artist Branding",
      tagline: "Visual identity | Professional image | Market positioning",
      description:
        "Complete brand development including visual identity, press kits, and business structuring to establish your professional market presence.",
      displayOrder: 6,
      enabled: true,
    },
    {
      id: "empire-signature-packages",
      name: "empire-signature-packages",
      emoji: "📦",
      title: "Empire Signature Packages",
      tagline: "All-inclusive | Career development | Premium support",
      description:
        "Comprehensive artist development programs combining multiple services for complete creative projects and long-term career growth.",
      displayOrder: 7,
      enabled: true,
    },
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Basic Empire Session",
      category: "🎙️ EMPIRE STUDIO SESSION",
      categoryId: "empire-studio-session",
      tagline: "Self-service | Fast takes | Affordable",
      price: 50000,
      enabled: true,
      description:
        "Quick vocal session for independent artists or engineers. No engineer included.",
      allowAddons: true,
    },
    {
      id: "2",
      name: "Empire Mic Session",
      category: "🎬 EMPIRE VIDEO & VISUAL PRODUCTION",
      categoryId: "empire-video-visual",
      tagline: "Flagship | Stylized Performance | Reels-Ready",
      price: 150000,
      enabled: true,
      description:
        "High-quality visual performance video with dramatic lighting, colored background, and creative post-editing.",
      allowAddons: true,
    },
    {
      id: "3",
      name: "High-Fashion Artist Photoshoot",
      category: "📸 EMPIRE PHOTOSHOOT",
      categoryId: "empire-photoshoot",
      tagline: "Magazine-Ready | Styled | Statement Looks",
      price: 80000,
      enabled: true,
      description:
        "Professional fashion photography with bold styling, poses, and editing for artists and brands.",
      allowAddons: false,
    },
  ]);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);

  // Category Management Functions
  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category });
    setIsCreatingCategory(false);
  };

  const handleCreateCategory = () => {
    setEditingCategory({
      id: "",
      name: "",
      emoji: "🎵",
      title: "",
      tagline: "",
      description: "",
      displayOrder: categories.length + 1,
      enabled: true,
    });
    setIsCreatingCategory(true);
  };

  const handleSaveCategory = () => {
    if (!editingCategory) return;

    if (!editingCategory.title || !editingCategory.name) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isCreatingCategory) {
      const newCategory = {
        ...editingCategory,
        id: editingCategory.name || Date.now().toString(),
      };
      setCategories((prev) => [...prev, newCategory]);
      toast({ title: "Category created successfully" });
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? editingCategory : c)),
      );
      toast({ title: "Category updated successfully" });
    }

    setEditingCategory(null);
    setIsCreatingCategory(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Category deleted successfully" });
  };

  const toggleCategoryEnabled = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
    );
  };

  // Service Management Functions
  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setIsCreatingService(false);
  };

  const handleCreateService = () => {
    setEditingService({
      id: "",
      name: "",
      category: categories[0]?.title || "",
      categoryId: categories[0]?.id || "",
      tagline: "",
      price: 0,
      enabled: true,
      description: "",
      allowAddons: false,
    });
    setIsCreatingService(true);
  };

  const handleSaveService = () => {
    if (!editingService) return;

    if (!editingService.name || !editingService.categoryId) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isCreatingService) {
      const newService = {
        ...editingService,
        id: Date.now().toString(),
      };
      setServices((prev) => [...prev, newService]);
      toast({ title: "Service created successfully" });
    } else {
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? editingService : s)),
      );
      toast({ title: "Service updated successfully" });
    }

    setEditingService(null);
    setIsCreatingService(false);
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Service deleted successfully" });
  };

  const toggleServiceEnabled = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  const toggleServiceAddons = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, allowAddons: !s.allowAddons } : s,
      ),
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Categories & Services Management
        </h2>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        {/* CATEGORIES TAB */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              Manage Categories
            </h3>
            <Button
              onClick={handleCreateCategory}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            {categories
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((category, index) => (
                <Card
                  key={category.id}
                  className="bg-slate-900 border-gray-700"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-2xl">{category.emoji}</div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-white font-medium">
                              {category.title}
                            </h3>
                            <Switch
                              checked={category.enabled}
                              onCheckedChange={() =>
                                toggleCategoryEnabled(category.id)
                              }
                            />
                          </div>
                          <p className="text-amber-400 text-sm">
                            {category.tagline}
                          </p>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEditCategory(category)}
                          size="sm"
                          variant="outline"
                          className="border-gray-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCategory(category.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Edit/Create Category Modal */}
          {editingCategory && (
            <Card className="bg-slate-900 border-amber-500">
              <CardHeader>
                <CardTitle className="text-white">
                  {isCreatingCategory ? "Create New Category" : "Edit Category"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Category ID/Name *
                    </Label>
                    <Input
                      id="name"
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory((prev) =>
                          prev ? { ...prev, name: e.target.value } : null,
                        )
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="empire-studio-session"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emoji" className="text-white">
                      Emoji
                    </Label>
                    <Input
                      id="emoji"
                      value={editingCategory.emoji}
                      onChange={(e) =>
                        setEditingCategory((prev) =>
                          prev ? { ...prev, emoji: e.target.value } : null,
                        )
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="🎙️"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="title" className="text-white">
                    Category Title *
                  </Label>
                  <Input
                    id="title"
                    value={editingCategory.title}
                    onChange={(e) =>
                      setEditingCategory((prev) =>
                        prev ? { ...prev, title: e.target.value } : null,
                      )
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Empire Studio Session"
                  />
                </div>

                <div>
                  <Label htmlFor="tagline" className="text-white">
                    Tagline
                  </Label>
                  <Input
                    id="tagline"
                    value={editingCategory.tagline}
                    onChange={(e) =>
                      setEditingCategory((prev) =>
                        prev ? { ...prev, tagline: e.target.value } : null,
                      )
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Hit-focused | Vocal takes"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editingCategory.description}
                    onChange={(e) =>
                      setEditingCategory((prev) =>
                        prev ? { ...prev, description: e.target.value } : null,
                      )
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Detailed description of this category..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingCategory.enabled}
                    onCheckedChange={(checked) =>
                      setEditingCategory((prev) =>
                        prev ? { ...prev, enabled: checked } : null,
                      )
                    }
                  />
                  <Label className="text-white">Category Enabled</Label>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleSaveCategory}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    {isCreatingCategory ? "Create" : "Save Changes"}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingCategory(null);
                      setIsCreatingCategory(false);
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
        </TabsContent>

        {/* SERVICES TAB */}
        <TabsContent value="services" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              Manage Services
            </h3>
            <Button
              onClick={handleCreateService}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>

          {/* Services List by Category */}
          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="bg-slate-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-2xl">{category.emoji}</span>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {services
                      .filter((s) => s.categoryId === category.id)
                      .map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-white font-medium">
                                {service.name}
                              </h4>
                              <Switch
                                checked={service.enabled}
                                onCheckedChange={() =>
                                  toggleServiceEnabled(service.id)
                                }
                              />
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-400">
                                  Add-ons:
                                </span>
                                <Switch
                                  checked={service.allowAddons}
                                  onCheckedChange={() =>
                                    toggleServiceAddons(service.id)
                                  }
                                  size="sm"
                                />
                              </div>
                            </div>
                            <p className="text-amber-400 text-sm">
                              {service.tagline}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              {service.description}
                            </p>
                            <p className="text-teal-400 text-sm">
                              {formatPrice(service.price)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleEditService(service)}
                              size="sm"
                              variant="outline"
                              className="border-gray-600"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteService(service.id)}
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    {services.filter((s) => s.categoryId === category.id)
                      .length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        No services in this category
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit/Create Service Modal */}
          {editingService && (
            <Card className="bg-slate-900 border-teal-500">
              <CardHeader>
                <CardTitle className="text-white">
                  {isCreatingService ? "Create New Service" : "Edit Service"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="serviceName" className="text-white">
                    Service Name *
                  </Label>
                  <Input
                    id="serviceName"
                    value={editingService.name}
                    onChange={(e) =>
                      setEditingService((prev) =>
                        prev ? { ...prev, name: e.target.value } : null,
                      )
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Basic Empire Session"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-white">
                    Category *
                  </Label>
                  <Select
                    value={editingService.categoryId}
                    onValueChange={(value) => {
                      const selectedCategory = categories.find(
                        (cat) => cat.id === value,
                      );
                      setEditingService((prev) =>
                        prev
                          ? {
                              ...prev,
                              categoryId: value,
                              category: selectedCategory?.title || "",
                            }
                          : null,
                      );
                    }}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tagline" className="text-white">
                    Tagline
                  </Label>
                  <Input
                    id="tagline"
                    value={editingService.tagline}
                    onChange={(e) =>
                      setEditingService((prev) =>
                        prev ? { ...prev, tagline: e.target.value } : null,
                      )
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Self-service | Fast takes | Affordable"
                  />
                </div>

                <div>
                  <Label htmlFor="price" className="text-white">
                    Price (₦)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService((prev) =>
                        prev
                          ? { ...prev, price: Number(e.target.value) }
                          : null,
                      )
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editingService.description}
                    onChange={(e) =>
                      setEditingService((prev) =>
                        prev ? { ...prev, description: e.target.value } : null,
                      )
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Detailed service description..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingService.enabled}
                    onCheckedChange={(checked) =>
                      setEditingService((prev) =>
                        prev ? { ...prev, enabled: checked } : null,
                      )
                    }
                  />
                  <Label className="text-white">Service Enabled</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingService.allowAddons}
                    onCheckedChange={(checked) =>
                      setEditingService((prev) =>
                        prev ? { ...prev, allowAddons: checked } : null,
                      )
                    }
                  />
                  <Label className="text-white">Allow Add-ons</Label>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleSaveService}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {isCreatingService ? "Create" : "Save Changes"}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingService(null);
                      setIsCreatingService(false);
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryAndServicesManager;
