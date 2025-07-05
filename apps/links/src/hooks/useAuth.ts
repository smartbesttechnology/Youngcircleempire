import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signUp, 
  signIn, 
  resetPassword, 
  updatePassword,
  createUserProfile,
  checkUsernameAvailability,
  AuthError,
  type SignUpData,
  type SignInData,
  type ResetPasswordData,
  type UpdatePasswordData
} from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refreshUserProfile } = useAuth();

  const handleSignUp = async (data: SignUpData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signUp(data);
      
      if (result.user) {
        // Redirect to onboarding to set up username
        navigate('/onboarding');
      }
      
      return result;
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (data: SignInData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn(data);
      
      if (result.user) {
        // Refresh user profile to get latest data
        await refreshUserProfile();
        navigate('/dashboard');
      }
      
      return result;
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordData) => {
    setLoading(true);
    setError(null);
    
    try {
      await resetPassword(data);
      return true;
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (data: UpdatePasswordData) => {
    setLoading(true);
    setError(null);
    
    try {
      await updatePassword(data);
      return true;
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    handleSignUp,
    handleSignIn,
    handleResetPassword,
    handleUpdatePassword,
    clearError,
  };
}

export function useUsernameValidation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateUsername = (username: string): string | null => {
    if (!username) {
      return 'Username is required';
    }
    
    if (username.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    
    if (username.length > 30) {
      return 'Username must be no more than 30 characters long';
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    
    return null;
  };

  const checkAvailability = async (username: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const validationError = validateUsername(username);
      if (validationError) {
        setError(validationError);
        return false;
      }

      const isAvailable = await checkUsernameAvailability(username);
      
      if (!isAvailable) {
        setError('Username is not available');
      }
      
      return isAvailable;
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while checking username');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    validateUsername,
    checkAvailability,
    clearError,
  };
}

export function useUserProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshUserProfile } = useAuth();

  const createProfile = async (data: {
    authUserId: string;
    email: string;
    username: string;
    fullName?: string;
    bio?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const profile = await createUserProfile(data);
      await refreshUserProfile();
      return profile;
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while creating profile');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    createProfile,
    clearError,
  };
}
