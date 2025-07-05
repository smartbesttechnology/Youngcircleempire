import { z } from 'zod';

// Auth validation schemas
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be less than 100 characters'),
  confirmPassword: z.string(),
  fullName: z
    .string()
    .max(100, 'Full name must be less than 100 characters')
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be less than 100 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Username validation schema
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters long')
  .max(30, 'Username must be no more than 30 characters long')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens'
  )
  .refine((username) => {
    // Check for reserved words
    const reservedWords = [
      'admin', 'api', 'dashboard', 'app', 'www', 'mail', 'email', 'support',
      'help', 'about', 'contact', 'privacy', 'terms', 'login', 'register',
      'signup', 'signin', 'logout', 'settings', 'profile', 'user', 'users',
      'account', 'accounts', 'billing', 'payment', 'payments', 'subscription',
      'subscriptions', 'plan', 'plans', 'pricing', 'blog', 'news', 'press',
      'legal', 'security', 'status', 'health', 'ping', 'test', 'demo',
      'example', 'sample', 'null', 'undefined', 'true', 'false', 'root',
      'system', 'config', 'configuration', 'setup', 'install', 'update',
      'upgrade', 'download', 'upload', 'file', 'files', 'image', 'images',
      'video', 'videos', 'audio', 'music', 'photo', 'photos', 'document',
      'documents', 'link', 'links', 'url', 'urls', 'redirect', 'redirects',
      'short', 'shorten', 'tiny', 'bit', 'go', 'get', 'post', 'put', 'delete',
      'patch', 'head', 'options', 'trace', 'connect'
    ];
    return !reservedWords.includes(username.toLowerCase());
  }, 'This username is reserved and cannot be used');

// Profile validation schemas
export const onboardingSchema = z.object({
  username: usernameSchema,
  fullName: z
    .string()
    .max(100, 'Full name must be less than 100 characters')
    .optional(),
  bio: z
    .string()
    .max(160, 'Bio must be less than 160 characters')
    .optional(),
});

export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .max(100, 'Full name must be less than 100 characters')
    .optional(),
  bio: z
    .string()
    .max(160, 'Bio must be less than 160 characters')
    .optional(),
  profileImage: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  theme: z.enum(['light', 'dark', 'custom']).default('light'),
});

// Link validation schemas
export const linkSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL')
    .refine((url) => {
      return url.startsWith('http://') || url.startsWith('https://');
    }, 'URL must start with http:// or https://'),
  icon: z
    .string()
    .max(10, 'Icon must be less than 10 characters')
    .optional(),
  visible: z.boolean().default(true),
});

export const linkUpdateSchema = linkSchema.partial().extend({
  id: z.string().uuid('Invalid link ID'),
});

// Type exports
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type LinkFormData = z.infer<typeof linkSchema>;
export type LinkUpdateFormData = z.infer<typeof linkUpdateSchema>;

// Validation helper functions
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown
): { success: boolean; error?: string; data?: T } {
  try {
    const data = schema.parse(value);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Validation failed' };
    }
    return { success: false, error: 'Validation failed' };
  }
}

export function getFieldError(
  errors: z.ZodError,
  fieldName: string
): string | undefined {
  const fieldError = errors.errors.find(error => 
    error.path.includes(fieldName)
  );
  return fieldError?.message;
}

// URL validation helper
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// Email validation helper
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Username availability check helper
export function validateUsernameFormat(username: string): string | null {
  const result = validateField(usernameSchema, username);
  return result.success ? null : result.error || 'Invalid username';
}

// Sanitize input helper
export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

// File size validation helper
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

// Image file type validation helper
export function validateImageType(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
}
