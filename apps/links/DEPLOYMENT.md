# Deployment Guide - YC Empire Links

## 🚀 Quick Deployment to Vercel

### 1. Prerequisites
- GitHub repository with the code
- Vercel account
- Supabase project (already configured)

### 2. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to the links app
cd apps/links

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub: `smartbesttechnology/Youngcircleempire`
4. Set **Root Directory** to: `apps/links`
5. **Framework Preset**: Vite
6. Click "Deploy"

### 3. Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Domains"
3. Add domain: `links.ycempire.studio`
4. Configure DNS records as instructed

### 4. Environment Variables

The app uses the existing Supabase configuration, so no additional environment variables are needed for basic functionality.

For email functionality (when ready):
```bash
RESEND_API_KEY=your_resend_api_key_here
```

## 🔧 Build Configuration

The app is configured with:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Framework**: Vite (React)

## 📁 Project Structure for Deployment

```
apps/links/
├── dist/              # Build output (auto-generated)
├── src/               # Source code
├── public/            # Static assets
├── package.json       # Dependencies
├── vite.config.ts     # Build configuration
├── vercel.json        # Vercel configuration
└── index.html         # Entry point
```

## 🌐 Expected URLs

After deployment:
- **Main App**: `https://your-app.vercel.app` or `https://links.ycempire.studio`
- **Login**: `https://links.ycempire.studio/login`
- **Public Profiles**: `https://links.ycempire.studio/{username}`

## ✅ Post-Deployment Checklist

1. **Test Authentication**
   - Sign up for a new account
   - Verify login/logout works
   - Check onboarding flow

2. **Test Profile Creation**
   - Complete username selection
   - Add profile information
   - Create test links

3. **Test Public Profiles**
   - Visit `/{username}` URL
   - Verify responsive design
   - Test link clicks

4. **Check Console Logs**
   - Verify no critical errors
   - Check email template logs
   - Monitor performance

## 🐛 Troubleshooting

### Common Deployment Issues

1. **Build Fails**
   ```bash
   # Check dependencies
   npm install
   npm run build
   ```

2. **404 on Routes**
   - Verify `vercel.json` is configured correctly
   - Check SPA routing setup

3. **Supabase Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Test database connection

4. **Username Validation Issues**
   - Check browser console for errors
   - Verify Supabase function calls
   - Test with different usernames

### Performance Optimization

1. **Enable Compression**
   - Vercel automatically handles this

2. **Optimize Images**
   - Use WebP format when possible
   - Implement lazy loading

3. **Bundle Analysis**
   ```bash
   npm run build
   npx vite-bundle-analyzer dist
   ```

## 📊 Monitoring

### Vercel Analytics
- Enable in Vercel dashboard
- Monitor page views and performance
- Track user engagement

### Error Tracking
- Check Vercel function logs
- Monitor browser console errors
- Set up error reporting (optional)

## 🔄 Updates and Maintenance

### Deploying Updates
```bash
# Make changes
git add .
git commit -m "Update: description"
git push origin main

# Vercel auto-deploys from main branch
```

### Database Migrations
- Use Supabase dashboard for schema changes
- Test changes in development first
- Update TypeScript types if needed

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit API keys
   - Use Vercel environment variables
   - Rotate keys regularly

2. **Domain Security**
   - Enable HTTPS (automatic with Vercel)
   - Configure proper CORS headers
   - Implement rate limiting if needed

3. **Database Security**
   - RLS policies are already configured
   - Monitor for suspicious activity
   - Regular security audits

## 📈 Scaling Considerations

### Traffic Growth
- Vercel automatically scales
- Monitor bandwidth usage
- Consider CDN for assets

### Database Scaling
- Supabase handles scaling
- Monitor connection limits
- Optimize queries as needed

### Feature Additions
- Email service integration
- Analytics implementation
- Additional themes/customization

---

## 🎉 Success!

Your YC Empire Links system should now be live and ready for users to create their bio link pages!

**Test URL**: Visit your deployment URL and create a test account to verify everything works correctly.

For support or issues, check the Vercel deployment logs and Supabase dashboard.
