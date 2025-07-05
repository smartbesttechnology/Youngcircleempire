import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUsernameValidation, useUserProfile } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function Onboarding() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  
  const { 
    loading: validationLoading, 
    error: validationError, 
    validateUsername, 
    checkAvailability,
    clearError: clearValidationError 
  } = useUsernameValidation();
  
  const { 
    loading: profileLoading, 
    error: profileError, 
    createProfile,
    clearError: clearProfileError 
  } = useUserProfile();

  // Redirect if user already has a profile
  useEffect(() => {
    if (userProfile) {
      navigate('/dashboard');
    }
  }, [userProfile, navigate]);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Set initial full name from auth metadata
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [user]);

  // Debounced username checking
  useEffect(() => {
    if (!username) {
      setUsernameStatus('idle');
      clearValidationError();
      return;
    }

    const validationError = validateUsername(username);
    if (validationError) {
      setUsernameStatus('unavailable');
      return;
    }

    setIsCheckingUsername(true);
    setUsernameStatus('checking');
    
    const timeoutId = setTimeout(async () => {
      try {
        const isAvailable = await checkAvailability(username);
        setUsernameStatus(isAvailable ? 'available' : 'unavailable');
      } catch (error) {
        setUsernameStatus('unavailable');
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username, validateUsername, checkAvailability, clearValidationError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (usernameStatus !== 'available') {
      return;
    }

    try {
      await createProfile({
        authUserId: user.id,
        email: user.email!,
        username,
        fullName: fullName || undefined,
        bio: bio || undefined,
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const getUsernameStatusIcon = () => {
    switch (usernameStatus) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-gray-500" />;
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unavailable':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getUsernameStatusMessage = () => {
    if (validationError) {
      return validationError;
    }
    
    switch (usernameStatus) {
      case 'checking':
        return 'Checking availability...';
      case 'available':
        return 'Username is available!';
      case 'unavailable':
        return 'Username is not available';
      default:
        return '';
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to YC Empire Links!</CardTitle>
          <CardDescription>
            Let's set up your profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="your-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className="pr-10"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getUsernameStatusIcon()}
                </div>
              </div>
              {username && (
                <div className="text-xs">
                  <span className="text-gray-500">Your link will be: </span>
                  <span className="font-mono">links.ycempire.studio/{username}</span>
                </div>
              )}
              {(validationError || usernameStatus !== 'idle') && (
                <p className={`text-xs ${
                  usernameStatus === 'available' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getUsernameStatusMessage()}
                </p>
              )}
            </div>

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
              <Input
                id="bio"
                type="text"
                placeholder="Tell people about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {profileError && (
              <div className="text-red-600 text-sm">
                {profileError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                profileLoading || 
                isCheckingUsername || 
                usernameStatus !== 'available' || 
                !username
              }
            >
              {profileLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Create Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
