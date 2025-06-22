import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewLink {
  title: string;
  slug: string;
  type: string;
  theme: string;
  description: string;
}

const SmartLinksManager = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<NewLink>({
    title: "",
    slug: "",
    type: "artist",
    theme: "black",
    description: ""
  });

  const handleChange = (key: keyof NewLink, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.title) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("smart_links").insert({
      title: form.title,
      slug: form.slug,
      type: form.type,
      theme: form.theme,
      description: form.description,
      enabled: true
    });
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Smart link created" });
    setForm({ title: "", slug: "", type: "artist", theme: "black", description: "" });
  };

  return (
    <Card className="bg-slate-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Create Smart Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={e => handleChange("title", e.target.value)} />
          </div>
          <div>
          <Label>Slug</Label>
          <Input value={form.slug} onChange={e => handleChange("slug", e.target.value)} />
        </div>
        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={v => handleChange("type", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="artist">Artist</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Theme</Label>
          <Input value={form.theme} onChange={e => handleChange("theme", e.target.value)} placeholder="e.g. #000" />
        </div>
        <div>
          <Label>Description</Label>
          <Input value={form.description} onChange={e => handleChange("description", e.target.value)} />
        </div>
        <Button type="submit" className="bg-amber-600 hover:bg-amber-700">Create</Button>
      </form>
      </CardContent>
    </Card>
  );
};

export default SmartLinksManager;
