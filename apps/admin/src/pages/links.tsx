import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Link as LinkIcon,
  Users,
  Search,
  Eye,
  Trash2,
  Ban,
  Flag,
  ExternalLink,
  User,
  Globe,
  Shield,
  Plus,
  Settings,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { supabase } from '../lib/supabase'

interface LinkProfile {
  id: string
  username: string
  display_name: string
  bio: string
  avatar_url: string
  is_active: boolean
  created_at: string
  links: LinkItem[]
}

interface LinkItem {
  id: string
  title: string
  url: string
  is_active: boolean
  order_index: number
}

export function LinksPage() {
  const [profiles, setProfiles] = useState<LinkProfile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<LinkProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<LinkProfile | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchProfiles()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [profiles, searchTerm, statusFilter])

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('link_profiles')
        .select(`
          *,
          links:link_items(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching link profiles:', error)
        setError(`Failed to load link profiles: ${error.message}`)
        return
      }

      setProfiles(data || [])
    } catch (err: any) {
      console.error('Exception fetching link profiles:', err)
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...profiles]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(profile =>
        profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.display_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active'
      filtered = filtered.filter(profile => profile.is_active === isActive)
    }

    setFilteredProfiles(filtered)
  }

  const updateProfileStatus = async (profileId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('link_profiles')
        .update({ is_active: isActive })
        .eq('id', profileId)

      if (error) {
        console.error('Error updating profile status:', error)
        alert(`Failed to update status: ${error.message}`)
        return
      }

      // Update local state
      setProfiles(prev => prev.map(profile =>
        profile.id === profileId ? { ...profile, is_active: isActive } : profile
      ))

      console.log(`Profile ${profileId} status updated to ${isActive ? 'active' : 'inactive'}`)
    } catch (err: any) {
      console.error('Exception updating profile status:', err)
      alert(`Error: ${err.message}`)
    }
  }

  const deleteProfile = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('link_profiles')
        .delete()
        .eq('id', profileId)

      if (error) {
        console.error('Error deleting profile:', error)
        alert(`Failed to delete profile: ${error.message}`)
        return
      }

      // Update local state
      setProfiles(prev => prev.filter(profile => profile.id !== profileId))
      setShowDeleteDialog(false)
      setProfileToDelete(null)

      console.log(`Profile ${profileId} deleted successfully`)
    } catch (err: any) {
      console.error('Exception deleting profile:', err)
      alert(`Error: ${err.message}`)
    }
  }

  const handleViewDetails = (profile: LinkProfile) => {
    setSelectedProfile(profile)
    setShowDetailsModal(true)
  }

  const handleDeleteClick = (profileId: string) => {
    setProfileToDelete(profileId)
    setShowDeleteDialog(true)
  }

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Links Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading link profiles...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Links Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Error loading link profiles</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={fetchProfiles}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Links Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage link profiles and social media links ({filteredProfiles.length} total)
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Profile
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles.length}</div>
            <p className="text-xs text-muted-foreground">
              All link profiles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profiles.filter(p => p.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Live profiles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profiles.reduce((total, profile) => total + (profile.links?.length || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              All links combined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profiles.filter(p => {
                const profileDate = new Date(p.created_at)
                const now = new Date()
                return profileDate.getMonth() === now.getMonth() &&
                       profileDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              New profiles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredProfiles.length} of {profiles.length} profiles
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Professional Link Profiles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Link Profiles</CardTitle>
          <CardDescription>
            Showing {filteredProfiles.length} of {profiles.length} profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Links
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {profile.display_name || profile.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {profile.bio || 'No bio'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">@{profile.username}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/links/${profile.username}`, '_blank')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {profile.links?.length || 0} links
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={profile.is_active ? 'active' : 'inactive'}
                        onChange={(e) => updateProfileStatus(profile.id, e.target.value === 'active')}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-white dark:bg-gray-700 ${getStatusBadgeColor(profile.is_active)}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(profile)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(profile.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showDetailsModal && selectedProfile && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Profile Details</DialogTitle>
              <DialogDescription>
                View and manage link profile information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <p className="text-sm text-gray-600">@{selectedProfile.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Display Name</label>
                  <p className="text-sm text-gray-600">{selectedProfile.display_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <p className="text-sm text-gray-600">{selectedProfile.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-gray-600">{new Date(selectedProfile.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <p className="text-sm text-gray-600">{selectedProfile.bio || 'No bio'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Links ({selectedProfile.links?.length || 0})</label>
                <div className="space-y-2 mt-2">
                  {selectedProfile.links?.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{link.title}</div>
                        <div className="text-sm text-gray-500">{link.url}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {link.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Profile</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this profile? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => profileToDelete && deleteProfile(profileToDelete)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
