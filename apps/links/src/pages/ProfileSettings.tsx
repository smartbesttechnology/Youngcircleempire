import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, User } from 'lucide-react';
import type { UserUpdate } from '@/lib/types';

export default function ProfileSettings() {
  const { userProfile, refreshUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'custom'>('light');

  // Initialize form with current profile data
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setBio(userProfile.bio || '');
      setProfileImage(userProfile.profile_image || '');
      setTheme((userProfile.theme as 'light' | 'dark' | 'custom') || 'light');
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updateData: UserUpdate = {
        full_name: fullName || null,
        bio: bio || null,
        profile_image: profileImage || null,
        theme,
      };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userProfile.id);

      if (error) throw error;

      await refreshUserProfile();
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile) return;

    // For now, we'll just show a placeholder for image upload
    // In a real implementation, you'd upload to Supabase Storage or another service
    setError('Image upload feature coming soon! For now, you can enter an image URL below.');
  };

  if (!userProfile) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Customize how your profile appears to visitors
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Upload a profile picture or enter an image URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <User className={`w-8 h-8 text-gray-400 ${profileImage ? 'hidden' : ''}`} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <Label htmlFor="imageUpload">Upload Image</Label>
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Or enter an image URL below
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profileImage">Image URL</Label>
                <Input
                  id="profileImage"
                  type="url"
                  placeholder="https://example.com/your-image.jpg"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Your name and bio that visitors will see
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  placeholder="Tell people about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  {bio.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Theme Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Choose how your profile page looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'light', label: 'Light', description: 'Clean and bright' },
                  { value: 'dark', label: 'Dark', description: 'Sleek and modern' },
                  { value: 'custom', label: 'Custom', description: 'Coming soon' },
                ].map((themeOption) => (
                  <div
                    key={themeOption.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      theme === themeOption.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${themeOption.value === 'custom' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (themeOption.value !== 'custom') {
                        setTheme(themeOption.value as 'light' | 'dark' | 'custom');
                      }
                    }}
                  >
                    <div className="text-sm font-medium">{themeOption.label}</div>
                    <div className="text-xs text-gray-500">{themeOption.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Error/Success Messages */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
              Profile updated successfully!
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
