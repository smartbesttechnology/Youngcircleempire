import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical,
  ExternalLink,
  Loader2
} from 'lucide-react';
import type { Link as LinkType, LinkInsert, LinkUpdate } from '@/lib/types';

interface LinkFormData {
  title: string;
  url: string;
  icon: string;
  visible: boolean;
}

export default function LinksManagement() {
  const { userProfile } = useAuth();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);
  const [formData, setFormData] = useState<LinkFormData>({
    title: '',
    url: '',
    icon: '',
    visible: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      fetchLinks();
    }
  }, [userProfile]);

  const fetchLinks = async () => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
      setError('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      icon: '',
      visible: true,
    });
    setEditingLink(null);
    setShowAddForm(false);
    setError(null);
  };

  const handleAddLink = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleEditLink = (link: LinkType) => {
    setFormData({
      title: link.title,
      url: link.url,
      icon: link.icon || '',
      visible: link.visible,
    });
    setEditingLink(link);
    setShowAddForm(true);
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.url.trim()) {
      setError('URL is required');
      return;
    }

    if (!validateUrl(formData.url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setFormLoading(true);
    setError(null);

    try {
      if (editingLink) {
        // Update existing link
        const updateData: LinkUpdate = {
          title: formData.title.trim(),
          url: formData.url.trim(),
          icon: formData.icon.trim() || null,
          visible: formData.visible,
        };

        const { error } = await supabase
          .from('links')
          .update(updateData)
          .eq('id', editingLink.id);

        if (error) throw error;
      } else {
        // Create new link
        const insertData: LinkInsert = {
          user_id: userProfile.id,
          title: formData.title.trim(),
          url: formData.url.trim(),
          icon: formData.icon.trim() || null,
          visible: formData.visible,
          display_order: links.length,
        };

        const { error } = await supabase
          .from('links')
          .insert(insertData);

        if (error) throw error;
      }

      await fetchLinks();
      resetForm();
    } catch (error) {
      console.error('Error saving link:', error);
      setError('Failed to save link. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;
      await fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      setError('Failed to delete link');
    }
  };

  const handleToggleVisibility = async (link: LinkType) => {
    try {
      const { error } = await supabase
        .from('links')
        .update({ visible: !link.visible })
        .eq('id', link.id);

      if (error) throw error;
      await fetchLinks();
    } catch (error) {
      console.error('Error updating link visibility:', error);
      setError('Failed to update link visibility');
    }
  };

  const moveLink = async (linkId: string, direction: 'up' | 'down') => {
    const currentIndex = links.findIndex(link => link.id === linkId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= links.length) return;

    const newLinks = [...links];
    [newLinks[currentIndex], newLinks[newIndex]] = [newLinks[newIndex], newLinks[currentIndex]];

    // Update display_order for both links
    try {
      const updates = newLinks.map((link, index) => ({
        id: link.id,
        display_order: index,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('links')
          .update({ display_order: update.display_order })
          .eq('id', update.id);

        if (error) throw error;
      }

      await fetchLinks();
    } catch (error) {
      console.error('Error reordering links:', error);
      setError('Failed to reorder links');
    }
  };

  if (!userProfile) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Links</h1>
            <p className="text-gray-600 mt-2">
              Add, edit, and organize your links
            </p>
          </div>
          <Button onClick={handleAddLink}>
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingLink ? 'Edit Link' : 'Add New Link'}
              </CardTitle>
              <CardDescription>
                {editingLink ? 'Update your link details' : 'Create a new link for your profile'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Link title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">URL *</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon (emoji or text)</Label>
                    <Input
                      id="icon"
                      type="text"
                      placeholder="🔗 or icon name"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="visible"
                        checked={formData.visible}
                        onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="visible">Visible on profile</Label>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingLink ? 'Update Link' : 'Add Link'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Links List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Links ({links.length})</CardTitle>
            <CardDescription>
              Drag to reorder, click to edit
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              </div>
            ) : links.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No links yet</p>
                <Button onClick={handleAddLink}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Link
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div
                    key={link.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveLink(link.id, 'up')}
                        disabled={index === 0}
                        className="h-4 w-4 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveLink(link.id, 'down')}
                        disabled={index === links.length - 1}
                        className="h-4 w-4 p-0"
                      >
                        ↓
                      </Button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {link.icon && (
                          <span className="text-lg">{link.icon}</span>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{link.title}</p>
                          <p className="text-sm text-gray-500 truncate">{link.url}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleVisibility(link)}
                      >
                        {link.visible ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLink(link)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
