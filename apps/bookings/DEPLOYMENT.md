# YC Empire Booking System - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prepare for Deployment

Make sure all your changes are committed:
```bash
git add .
git commit -m "Ready for Vercel deployment with Resend integration"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Navigate to the bookings app
cd apps/bookings

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set the root directory to `apps/bookings`
4. Deploy

### 3. Configure Environment Variables

After deployment, add these environment variables in your Vercel dashboard:

**Required Variables:**
- `RESEND_API_KEY` = `re_9cV1L9Ei_BMnNeSB6cTux4UZqncN1Zcux`

**Optional (if using server-side Supabase):**
- `VITE_SUPABASE_URL` = Your Supabase URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

### 4. Set Up Resend-Vercel Integration

1. In your Resend dashboard, go to **Settings** → **Integrations**
2. Click **"Go to Integration"** for Vercel
3. Connect your Vercel account
4. Select your YC Empire project
5. This will automatically set the `RESEND_API_KEY` environment variable

### 5. Test the Deployment

1. Visit your deployed URL
2. Fill out a booking form
3. Submit the booking
4. Check:
   - ✅ Database entry in Supabase
   - ✅ Email sent via Resend
   - ✅ Resend dashboard shows email activity

## 📁 Project Structure for Vercel

```
apps/bookings/
├── api/
│   └── send-email.js          # Vercel serverless function
├── src/                       # React app source
├── vercel.json               # Vercel configuration
├── package.json              # Dependencies
└── .env.example              # Environment variables template
```

## 🔧 Vercel Configuration

The `vercel.json` file configures:
- API routes in `/api` folder
- SPA routing for React app
- Node.js runtime for serverless functions

## 🚨 Troubleshooting

### Email Not Sending
1. Check Vercel environment variables are set
2. Verify Resend integration is connected
3. Check Vercel function logs
4. Ensure domain is verified in Resend

### Database Issues
1. Check Supabase connection
2. Verify RLS policies
3. Check browser console for errors

### Build Issues
1. Ensure all dependencies are in `package.json`
2. Check for TypeScript errors
3. Verify API routes are in correct format

## 📧 Email Flow in Production

```
User submits form → Vercel API route → Resend API → Email sent
                 ↓
              Supabase database updated
```

## 🎯 Post-Deployment Checklist

- [ ] Booking form loads correctly
- [ ] Database saves booking data
- [ ] Email confirmation is sent
- [ ] Thank you page displays
- [ ] Resend dashboard shows email activity
- [ ] All environment variables are set
- [ ] Domain is verified in Resend

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Resend Dashboard](https://resend.com/emails)
- [Supabase Dashboard](https://supabase.com/dashboard)
