import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

const CategoryManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "empire-studio-session",
      name: "empire-studio-session",
      emoji: "🎙️",
      title: "Empire Studio Session",
      tagline: "Hit-focused | Vocal takes",
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
        "Event planning, hosting, and professional coverage from intimate listening parties to full showcase events with full professional coverage.",
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

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category });
    setIsCreating(false);
  };

  const handleCreate = () => {
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
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!editingCategory) return;

    if (!editingCategory.title || !editingCategory.name) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isCreating) {
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
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Category deleted successfully" });
  };

  const toggleEnabled = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
    );
  };

  const moveCategory = (id: string, direction: "up" | "down") => {
    setCategories((prev) => {
      const currentIndex = prev.findIndex((c) => c.id === id);
      if (currentIndex === -1) return prev;

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newCategories = [...prev];
      const [removed] = newCategories.splice(currentIndex, 1);
      newCategories.splice(newIndex, 0, removed);

      // Update display order
      return newCategories.map((cat, index) => ({
        ...cat,
        displayOrder: index + 1,
      }));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Category Management</h2>
        <Button
          onClick={handleCreate}
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
            <Card key={category.id} className="bg-slate-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex flex-col space-y-1">
                      <Button
                        onClick={() => moveCategory(category.id, "up")}
                        disabled={index === 0}
                        size="sm"
                        variant="ghost"
                        className="h-4 p-0"
                      >
                        <GripVertical className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => moveCategory(category.id, "down")}
                        disabled={index === categories.length - 1}
                        size="sm"
                        variant="ghost"
                        className="h-4 p-0"
                      >
                        <GripVertical className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="text-2xl">{category.emoji}</div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-white font-medium">
                          {category.title}
                        </h3>
                        <Switch
                          checked={category.enabled}
                          onCheckedChange={() => toggleEnabled(category.id)}
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
                      onClick={() => handleEdit(category)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(category.id)}
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

      {/* Edit/Create Modal */}
      {editingCategory && (
        <Card className="bg-slate-900 border-amber-500">
          <CardHeader>
            <CardTitle className="text-white">
              {isCreating ? "Create New Category" : "Edit Category"}
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
                onClick={handleSave}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isCreating ? "Create" : "Save Changes"}
              </Button>
              <Button
                onClick={() => {
                  setEditingCategory(null);
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

export default CategoryManager;
