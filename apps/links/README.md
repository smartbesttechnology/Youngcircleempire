# YC Empire Links - Bio Link System

A Linktree-style bio link system built for Young Circle Empire Studio that allows artists and users to create customizable public profile pages and manage their links.

## 🌟 Features

### ✅ Completed Features

- **🔐 Authentication System**
  - Sign up with email + password
  - Login / logout functionality
  - Password reset via email
  - Secure session management with Supabase Auth

- **🧾 Username Registration**
  - Unique username selection during onboarding
  - Reserved words validation
  - Real-time availability checking
  - Custom profile URL: `https://links.ycempire.studio/{username}`

- **🗄️ Database Integration**
  - Users table with profile information
  - Links table with proper relationships
  - Row Level Security (RLS) policies
  - Automatic timestamps and constraints

- **🛠️ User Dashboard**
  - Profile management (bio, profile picture, theme)
  - Link management (add, edit, delete, reorder)
  - Visibility controls for links
  - Responsive design for mobile and desktop

- **🌐 Public Profile Pages**
  - Clean, responsive design
  - Theme support (light/dark)
  - Mobile-first approach
  - SEO-friendly structure

- **🎨 UI/UX**
  - Modern design with Tailwind CSS
  - Responsive mobile-first layout
  - Loading states and error handling
  - Toast notifications for user feedback

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router v6
- **Form Validation**: Zod
- **Build Tool**: Vite
- **Hosting**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apps/links
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The app uses the existing Supabase configuration from the monorepo. The database schema has been automatically created.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3004`

## 📁 Project Structure

```
apps/links/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── DashboardLayout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ErrorBoundary.tsx
│   ├── context/            # React context providers
│   │   └── AuthContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useFormValidation.ts
│   │   └── useToast.ts
│   ├── lib/                # Utility functions and configs
│   │   ├── supabase.ts     # Supabase client
│   │   ├── types.ts        # TypeScript types
│   │   ├── auth.ts         # Auth utilities
│   │   ├── validations.ts  # Zod schemas
│   │   └── utils.ts        # General utilities
│   ├── pages/              # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Onboarding.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LinksManagement.tsx
│   │   ├── ProfileSettings.tsx
│   │   ├── Settings.tsx
│   │   ├── PublicProfile.tsx
│   │   └── ForgotPassword.tsx
│   ├── App.tsx             # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## 🗄️ Database Schema

### Users Table
- `id` (UUID, primary key)
- `auth_user_id` (UUID, references auth.users)
- `email` (text, unique)
- `username` (text, unique)
- `full_name` (text, optional)
- `bio` (text, optional)
- `profile_image` (text, optional)
- `theme` (text, default: 'light')
- `created_at`, `updated_at` (timestamps)

### Links Table
- `id` (UUID, primary key)
- `user_id` (UUID, references users.id)
- `title` (text)
- `url` (text)
- `icon` (text, optional)
- `visible` (boolean, default: true)
- `display_order` (integer)
- `created_at`, `updated_at` (timestamps)

## 🔐 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **User isolation** - users can only access their own data
- **Public read access** for visible links and user profiles
- **Reserved username validation**
- **URL validation** for links
- **Input sanitization** and validation

## 🎯 Usage

### For Users

1. **Sign Up**: Create an account with email and password
2. **Choose Username**: Select a unique username during onboarding
3. **Customize Profile**: Add bio, profile picture, and choose theme
4. **Add Links**: Create and organize your links
5. **Share**: Share your profile at `links.ycempire.studio/{username}`

### For Developers

1. **Authentication**: Use the `useAuth` hook to access user state
2. **Form Validation**: Use `useFormValidation` with Zod schemas
3. **Error Handling**: Components are wrapped with ErrorBoundary
4. **Toast Notifications**: Use `useToast` for user feedback
5. **Protected Routes**: Use `ProtectedRoute` component for auth-required pages

## 🚀 Deployment

The app is configured for Vercel deployment:

1. **Connect to Vercel**
   ```bash
   vercel --prod
   ```

2. **Environment Variables**
   The app uses the existing Supabase configuration from the monorepo.

3. **Custom Domain** (Optional)
   Configure `links.ycempire.studio` to point to your Vercel deployment.

## 🔮 Future Enhancements

- Analytics and click tracking
- Custom themes and styling
- Social media integrations
- QR code generation
- Link scheduling
- Team collaboration features
- API for external integrations

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**: Ensure Supabase credentials are correct
2. **Authentication**: Check if Supabase Auth is properly configured
3. **Username Conflicts**: Reserved words are automatically blocked
4. **Image Upload**: Currently supports URL input only

### Development

- Check browser console for errors
- Verify database schema in Supabase dashboard
- Test authentication flow thoroughly
- Ensure RLS policies are working correctly

## 📞 Support

For issues or questions:
- Check the browser console for errors
- Verify Supabase configuration
- Contact the development team

---

Built with ❤️ for Young Circle Empire Studio
