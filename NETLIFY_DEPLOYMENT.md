# Netlify Deployment Guide for YCEmpire Apps

This guide will help you deploy your YCEmpire applications on Netlify as separate sites.

## 🏗️ Architecture Overview

Your applications will be deployed as 5 separate Netlify sites:

- **Main App** → `ycempire.com` (or custom domain)
- **Admin App** → `admin.ycempire.com` (or custom domain)
- **Bookings App** → `bookings.ycempire.com` (or custom domain)
- **Rentals App** → `rentals.ycempire.com` (or custom domain)
- **Links App** → `links.ycempire.com` (or custom domain)

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Domain Names**: Purchase or configure your domain names

## 🚀 Step-by-Step Deployment

### Step 1: Deploy Main App

1. **Go to Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Click "New site from Git"

2. **Connect to GitHub**
   - Choose GitHub as your Git provider
   - Authorize Netlify to access your repositories
   - Select `smartbesttechnology/Youngcircleempire`

3. **Configure Build Settings**
   - **Base directory**: `apps/main`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

### Step 2: Deploy Admin App

1. **Create New Site**
   - Click "New site from Git" again
   - Select the same repository

2. **Configure Build Settings**
   - **Base directory**: `apps/admin`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`

3. **Deploy**
   - Click "Deploy site"

### Step 3: Deploy Bookings App

1. **Create New Site**
   - Click "New site from Git"
   - Select the same repository

2. **Configure Build Settings**
   - **Base directory**: `apps/bookings`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`

3. **Deploy**
   - Click "Deploy site"

### Step 4: Deploy Rentals App

1. **Create New Site**
   - Click "New site from Git"
   - Select the same repository

2. **Configure Build Settings**
   - **Base directory**: `apps/rentals`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`

3. **Deploy**
   - Click "Deploy site"

### Step 5: Deploy Links App

1. **Create New Site**
   - Click "New site from Git"
   - Select the same repository

2. **Configure Build Settings**
   - **Base directory**: `apps/links`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`

3. **Deploy**
   - Click "Deploy site"

## 🌐 Custom Domain Configuration

### For Each Site:

1. **Go to Site Settings**
   - Click on your site in Netlify dashboard
   - Go to "Domain settings"

2. **Add Custom Domain**
   - Click "Add custom domain"
   - Enter your domain (e.g., `admin.ycempire.com`)

3. **Configure DNS**
   - Add CNAME record pointing to your Netlify site
   - Or use Netlify's nameservers for easier management

### DNS Records Example:

```
CNAME: admin.ycempire.com → your-admin-site.netlify.app
CNAME: bookings.ycempire.com → your-bookings-site.netlify.app
CNAME: rentals.ycempire.com → your-rentals-site.netlify.app
CNAME: links.ycempire.com → your-links-site.netlify.app
CNAME: ycempire.com → your-main-site.netlify.app
```

## 🔧 Environment Variables

### For Each Site, Add These Environment Variables:

1. **Go to Site Settings → Environment variables**
2. **Add the following variables:**

```
NODE_ENV=production
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Build Configuration Summary

| App | Base Directory | Build Command | Publish Directory |
|-----|----------------|---------------|-------------------|
| Main | `apps/main` | `npm install && npm run build` | `dist` |
| Admin | `apps/admin` | `npm install && npm run build` | `dist` |
| Bookings | `apps/bookings` | `npm install && npm run build` | `dist` |
| Rentals | `apps/rentals` | `npm install && npm run build` | `dist` |
| Links | `apps/links` | `npm install && npm run build` | `dist` |

## 🔄 Continuous Deployment

### Automatic Deployments

Once configured, Netlify will automatically:
- Deploy when you push to the `main` branch
- Deploy when you create pull requests
- Provide preview deployments for PRs

### Manual Deployments

You can also trigger manual deployments:
1. Go to your site in Netlify dashboard
2. Click "Deploys" tab
3. Click "Trigger deploy"

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Netlify dashboard
   - Verify all dependencies are in package.json
   - Ensure Node.js version is compatible

2. **404 Errors on Routes**
   - Netlify configuration includes redirects for SPA routing
   - Check that `netlify.toml` files are in each app directory

3. **Environment Variables Not Working**
   - Ensure variables are set in Netlify dashboard
   - Variables must be prefixed with `VITE_` for Vite apps

### Build Logs

To debug build issues:
1. Go to your site in Netlify dashboard
2. Click "Deploys" tab
3. Click on the failed deploy
4. Check the build log for errors

## 📈 Performance Optimization

### Netlify Features to Enable:

1. **Asset Optimization**
   - Enable "Asset optimization" in site settings
   - Enable "Pretty URLs" for cleaner URLs

2. **CDN**
   - Netlify automatically provides global CDN
   - No additional configuration needed

3. **Caching**
   - Configure cache headers in `netlify.toml` if needed

## 🔒 Security

### HTTPS
- Netlify automatically provides SSL certificates
- HTTPS is enabled by default

### Headers
Add security headers in `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

## 📊 Monitoring

### Netlify Analytics
- Enable "Analytics" in site settings
- View visitor statistics and performance metrics

### Form Handling
- Netlify automatically handles form submissions
- No additional backend needed for simple forms

## 🚀 Advanced Features

### Functions
- Deploy serverless functions alongside your sites
- Create `netlify/functions/` directory in each app

### Redirects
- Configure redirects in `netlify.toml`
- Handle old URLs and redirects

### Branch Deploys
- Deploy different branches to different URLs
- Perfect for staging and testing

## 📞 Support

### Netlify Support
- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community](https://community.netlify.com/)

### Build Issues
- Check build logs in Netlify dashboard
- Verify all dependencies are correctly specified
- Ensure Node.js version compatibility

## ✅ Deployment Checklist

- [ ] All 5 sites deployed on Netlify
- [ ] Custom domains configured
- [ ] Environment variables set
- [ ] SSL certificates active
- [ ] Builds completing successfully
- [ ] All routes working correctly
- [ ] Forms functioning (if applicable)
- [ ] Analytics enabled
- [ ] Performance optimized 