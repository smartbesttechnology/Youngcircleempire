# Young Circle Empire - Monorepo

A clean monorepo for Young Circle Empire's web applications, built with React, TypeScript, and modern tooling.

## 🏗️ **Monorepo Structure**

```
apps/
├── bookings/           # 🎙️ Studio Booking System (ACTIVE)
├── admin/              # 👨‍💼 Admin Dashboard (PLACEHOLDER)
├── rentals/            # 📹 Equipment Rental System (PLACEHOLDER)
└── links/              # 🔗 Link Management System (PLACEHOLDER)
```

## 🎯 **Current Status**

- ✅ **Bookings App**: Fully functional with Supabase integration and email confirmations
- 🚧 **Admin App**: Clean placeholder ready for development
- 🚧 **Rentals App**: Clean placeholder ready for development
- 🚧 **Links App**: Clean placeholder ready for development

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
# Clone and install
git clone <repository-url>
cd Youngcircleempire-1
npm install
```

### Development
```bash
# Start individual apps
npm run dev:bookings    # Bookings app on port 3002
npm run dev:admin       # Admin app
npm run dev:rentals     # Rentals app
npm run dev:links       # Links app

# Build individual apps
npm run build:bookings
npm run build:admin
npm run build:rentals
npm run build:links

# Lint all apps
npm run lint
```

## 📱 **Applications**

### 🎙️ Bookings App
- **Purpose**: Studio session booking system
- **Features**:
  - Multi-step booking form
  - Supabase database integration
  - Email confirmations via Resend API
  - Social media handle collection (Instagram/TikTok)
  - Real-time form validation
- **URL**: http://localhost:3002/

### 👨‍💼 Admin App (Coming Soon)
- **Purpose**: Administrative dashboard
- **Features**: TBD

### 📹 Rentals App (Coming Soon)
- **Purpose**: Equipment rental management
- **Features**: TBD

### 🔗 Links App (Coming Soon)
- **Purpose**: Link management system
- **Features**: TBD

## 🗄️ **Database**

- **Provider**: Supabase
- **Tables**:
  - `bookings` - Studio booking records with social media handles

## 🛠️ **Tech Stack**

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend API
- **Build Tool**: Vite
- **Monorepo**: npm workspaces
- **Hosting**: Vercel

## 🌐 **Deployment**

### Vercel Deployment (Recommended)

The booking system is configured for Vercel deployment with Resend email integration.

**Quick Deploy:**
```bash
cd apps/bookings
vercel --prod
```

**Required Environment Variables:**
- `RESEND_API_KEY` - Your Resend API key
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key

**Resend Integration:**
Use the Vercel integration in your Resend dashboard to automatically configure environment variables.

**For detailed deployment instructions:** [Deployment Guide](apps/bookings/DEPLOYMENT.md)

## 📝 **Development Notes**

- Each app is a separate workspace with its own dependencies
- Shared dependencies are managed at the root level
- Database schema is clean with only essential tables
- RLS policies configured for secure data access

## 🤝 **Contributing**

1. Focus on one app at a time
2. Keep the monorepo structure clean
3. Test thoroughly before committing
4. Update documentation as needed
