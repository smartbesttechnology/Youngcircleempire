import React, { useState } from 'react'
import { format } from 'date-fns'
import { ExternalLink, Edit, Trash2, Eye, EyeOff, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { 
  useUserDetails, 
  useUpdateUser, 
  useDeleteLink, 
  useToggleLinkVisibility 
} from '../../hooks/use-links'

interface UserProfileModalProps {
  userId: string
  open: boolean
  onClose: () => void
}

export function UserProfileModal({ userId, open, onClose }: UserProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    profile_image: ''
  })

  const { data: user, isLoading } = useUserDetails(userId)
  const updateUser = useUpdateUser()
  const deleteLink = useDeleteLink()
  const toggleLinkVisibility = useToggleLinkVisibility()

  // Initialize edit form when user data loads
  React.useEffect(() => {
    if (user && !isEditing) {
      setEditForm({
        full_name: user.full_name || '',
        bio: user.bio || '',
        profile_image: user.profile_image || ''
      })
    }
  }, [user, isEditing])

  const handleSaveProfile = () => {
    updateUser.mutate({
      id: userId,
      updates: editForm
    })
    setIsEditing(false)
  }

  const handleDeleteLink = (linkId: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      deleteLink.mutate(linkId)
    }
  }

  const handleToggleLink = (linkId: string, currentVisibility: boolean) => {
    toggleLinkVisibility.mutate({
      id: linkId,
      visible: !currentVisibility
    })
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <div className="text-center py-8">Loading user profile...</div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <div className="text-center py-8">User not found</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile: @{user.username}</DialogTitle>
          <DialogDescription>
            Manage user profile and links
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/links/${user.username}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public Page
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {(isEditing ? editForm.profile_image : user.profile_image) ? (
                    <img
                      src={isEditing ? editForm.profile_image : user.profile_image!}
                      alt={user.username}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Full name"
                        value={editForm.full_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                      />
                      <Input
                        placeholder="Bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      />
                      <Input
                        placeholder="Profile image URL"
                        value={editForm.profile_image}
                        onChange={(e) => setEditForm(prev => ({ ...prev, profile_image: e.target.value }))}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleSaveProfile}>
                          Save Changes
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {user.full_name || user.username}
                        </h3>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                      {user.bio && (
                        <p className="text-sm">{user.bio}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{user.email}</span>
                        <span>•</span>
                        <span>Joined {format(new Date(user.created_at!), 'MMM yyyy')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Links ({user.links?.length || 0})</CardTitle>
              <CardDescription>
                Manage user's link-in-bio links
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!user.links || user.links.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No links created yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.links
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((link) => (
                        <TableRow key={link.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {link.icon && <span>{link.icon}</span>}
                              <span className="font-medium">{link.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm truncate max-w-xs block"
                            >
                              {link.url}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge variant={link.visible ? 'success' : 'secondary'}>
                              {link.visible ? 'Visible' : 'Hidden'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {link.created_at && format(new Date(link.created_at), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleLink(link.id, link.visible)}
                              >
                                {link.visible ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteLink(link.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-muted-foreground">User ID</label>
                  <p className="font-mono">{user.id}</p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Auth User ID</label>
                  <p className="font-mono">{user.auth_user_id || 'Not linked'}</p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Theme</label>
                  <p>{user.theme || 'Default'}</p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Last Updated</label>
                  <p>
                    {user.updated_at && format(new Date(user.updated_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
