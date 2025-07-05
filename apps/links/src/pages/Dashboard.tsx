import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  BarChart3,
  Users,
  Link as LinkIcon
} from 'lucide-react';
import type { Link as LinkType } from '@/lib/types';

export default function Dashboard() {
  const { userProfile } = useAuth();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const visibleLinks = links.filter(link => link.visible);
  const hiddenLinks = links.filter(link => !link.visible);

  if (!userProfile) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {userProfile.full_name || userProfile.username}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Links</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{links.length}</div>
              <p className="text-xs text-muted-foreground">
                {visibleLinks.length} visible, {hiddenLinks.length} hidden
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Analytics coming soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Link Clicks</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Analytics coming soon
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Manage your bio page and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Public URL</p>
                  <p className="text-sm text-gray-500">
                    links.ycempire.studio/{userProfile.username}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://links.ycempire.studio/${userProfile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </a>
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button asChild className="flex-1">
                  <Link to="/dashboard/profile">
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/dashboard/settings">
                    Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Links</CardTitle>
              <CardDescription>
                Add and manage your links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                </div>
              ) : links.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">No links yet</p>
                  <Button asChild>
                    <Link to="/dashboard/links">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Link
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {links.slice(0, 3).map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          {link.visible ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm font-medium">{link.title}</span>
                        </div>
                      </div>
                    ))}
                    {links.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{links.length - 3} more links
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button asChild className="flex-1">
                      <Link to="/dashboard/links">
                        Manage Links
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link to="/dashboard/links">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Link
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
