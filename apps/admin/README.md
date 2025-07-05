# Young Circle Empire Admin Panel

A comprehensive admin dashboard for managing Young Circle Empire studio operations including bookings, equipment rentals, and user link profiles.

## 🚀 Features

### 🔐 Authentication & Security
- Secure login with Supabase authentication
- Protected routes with automatic redirects
- Session management and auto-logout
- Dark/Light theme support

### 📊 Dashboard Analytics
- Real-time statistics and growth metrics
- Interactive charts (booking trends, service popularity, equipment usage)
- Recent activity overview
- Quick action buttons

### 🎙️ Bookings Management
- View and manage all studio bookings
- Advanced filtering (status, date range, service, search)
- Inline status updates (pending → confirmed → cancelled)
- Detailed booking information modals
- Services and categories CRUD management
- Real-time updates via Supabase subscriptions

### 🎥 Rentals Management
- Equipment rental requests management
- Equipment inventory with categories
- Pricing management per equipment item
- Equipment status control (available/disabled)
- Image support for equipment items
- Rental workflow (pending → confirmed → picked up → returned)

### 🔗 Links Management
- User link profile management
- Search and filter users
- Edit user profiles and bio information
- Toggle link visibility
- Content moderation tools
- Public page preview

### 🌙 Dark Mode Support
- Full dark mode implementation
- Theme toggle in navigation and login page
- Consistent styling across all components
- Automatic theme persistence

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase project

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the admin panel**
   - URL: http://localhost:3001
   - Email: admin@ycempire.studio
   - Password: Jonah@180

## 📋 Database Schema

The admin panel works with the following Supabase tables:

### Core Tables
- `bookings` - Studio booking requests
- `users` - User profiles for link system
- `links` - User bio links
- `equipment_rentals` - Equipment rental requests

### Management Tables
- `booking_categories` - Service categories
- `services` - Available services
- `equipment_categories` - Equipment categories  
- `equipment_items` - Rental equipment inventory
- `addons` - Additional services

## 🔧 Configuration

### Environment Variables
The app uses Supabase configuration embedded in the code. For production, move these to environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup
1. Create tables using the provided schema
2. Set up Row Level Security (RLS) policies
3. Configure authentication settings
4. Enable real-time subscriptions

## 📱 Usage

### Login
1. Navigate to http://localhost:3001
2. Use the provided admin credentials
3. Toggle dark/light mode as needed

### Managing Bookings
1. Go to Bookings section
2. View all bookings in real-time table
3. Filter by status, date, or service
4. Click on bookings to view details
5. Update status inline or delete bookings
6. Manage services and categories

### Managing Rentals
1. Go to Rentals section
2. Switch between rental requests and equipment inventory
3. Update rental status and manage equipment
4. Add/edit equipment items and categories
5. Set pricing and availability

### Managing Links
1. Go to Links section
2. Search and view all user profiles
3. Click on users to manage their links
4. Toggle link visibility or delete links
5. Edit user profile information

## 🎨 Customization

### Themes
- Light and dark themes included
- Customize colors in `src/index.css`
- Theme persistence via localStorage

### Components
- Reusable UI components in `src/components/ui/`
- Consistent design system with Radix UI
- Easy to extend and customize

## 🔄 Real-time Features

The admin panel includes real-time updates for:
- New bookings and rentals
- Status changes
- User profile updates
- Equipment availability changes

All powered by Supabase real-time subscriptions.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm run deploy
```

## 📞 Support

For support and questions about the Young Circle Empire Admin Panel, contact the development team.

---

**Young Circle Empire Studio Admin Panel** - Built with ❤️ for efficient studio management.
