import { supabase } from './supabase';
import type { User } from './types';
import { getEmailConfirmationTemplate, getWelcomeEmailTemplate } from './emailTemplates';

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdatePasswordData {
  password: string;
}

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Sign up a new user with email and password
 */
export async function signUp({ email, password, fullName }: SignUpData) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('An unexpected error occurred during sign up');
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn({ email, password }: SignInData) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('An unexpected error occurred during sign in');
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new AuthError(error.message, error.message);
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('An unexpected error occurred during sign out');
  }
}

/**
 * Send password reset email
 */
export async function resetPassword({ email }: ResetPasswordData) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new AuthError(error.message, error.message);
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('An unexpected error occurred during password reset');
  }
}

/**
 * Update user password
 */
export async function updatePassword({ password }: UpdatePasswordData) {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw new AuthError(error.message, error.message);
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('An unexpected error occurred during password update');
  }
}

/**
 * Get the current user session
 */
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return session;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('An unexpected error occurred while getting session');
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return user;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('An unexpected error occurred while getting user');
  }
}

/**
 * Check if username is available
 */
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    // First check if it's a reserved username
    const { data: isReserved, error: reservedError } = await supabase
      .rpc('is_username_reserved', { username_to_check: username });

    if (reservedError) {
      throw new AuthError('Error checking username availability');
    }

    if (isReserved) {
      return false;
    }

    // Then check if it's already taken
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw new AuthError('Error checking username availability');
    }

    return !data; // Available if no data found
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('An unexpected error occurred while checking username');
  }
}

/**
 * Create user profile after successful authentication
 */
export async function createUserProfile(userData: {
  authUserId: string;
  email: string;
  username: string;
  fullName?: string;
  bio?: string;
}): Promise<User> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        auth_user_id: userData.authUserId,
        email: userData.email,
        username: userData.username,
        full_name: userData.fullName,
        bio: userData.bio,
      })
      .select()
      .single();

    if (error) {
      throw new AuthError(error.message, error.code);
    }

    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('An unexpected error occurred while creating user profile');
  }
}

/**
 * Get user profile by auth user ID
 */
export async function getUserProfile(authUserId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw new AuthError(error.message, error.code);
    }

    return data || null;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('An unexpected error occurred while getting user profile');
  }
}

/**
 * Get user profile by username (for public pages)
 */
export async function getUserProfileByUsername(username: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw new AuthError(error.message, error.code);
    }

    return data || null;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('An unexpected error occurred while getting user profile');
  }
}

/**
 * Send welcome email after successful profile creation
 */
export async function sendWelcomeEmail(username: string, userEmail?: string): Promise<void> {
  try {
    if (!userEmail) {
      console.log('No email provided for welcome email');
      return;
    }

    const profileUrl = `https://links.ycempire.studio/${username}`;
    const emailTemplate = getWelcomeEmailTemplate(username, profileUrl);

    // Send email via API endpoint
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send welcome email:', errorData);
    } else {
      const result = await response.json();
      console.log('Welcome email sent successfully:', result.messageId);
    }

  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error as this shouldn't block profile creation
  }
}

/**
 * Send email confirmation email
 */
export async function sendEmailConfirmation(email: string, confirmationUrl: string): Promise<void> {
  try {
    const emailTemplate = getEmailConfirmationTemplate(confirmationUrl);

    // Send email via API endpoint
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send confirmation email:', errorData);
    } else {
      const result = await response.json();
      console.log('Confirmation email sent successfully:', result.messageId);
    }

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw error as this shouldn't block signup
  }
}
