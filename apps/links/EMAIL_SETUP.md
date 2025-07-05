# Email System Setup - YC Empire Links

This document explains how to set up and configure the email system for YC Empire Links.

## 📧 Email Templates

The system includes two beautiful, responsive email templates:

### 1. Email Confirmation Template
- **Purpose**: Sent when users sign up to verify their email address
- **Features**: 
  - YC Empire branding with logo
  - Security notes and expiration warning
  - Mobile-responsive design
  - Clear call-to-action button

### 2. Welcome Email Template
- **Purpose**: Sent after successful profile creation
- **Features**:
  - Personalized welcome message
  - Profile URL display
  - Feature highlights
  - Action buttons (View Profile, Manage Links)
  - Social media links

## 🎨 Design Features

- **Branding**: Uses YC Empire logo from `https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png`
- **Colors**: Purple gradient theme matching the app design
- **Responsive**: Works perfectly on desktop and mobile email clients
- **Professional**: Clean, modern layout with proper spacing and typography

## 🔧 Technical Setup

### Current Implementation

The email templates are ready and the system logs email content to console. To enable actual email sending:

### 1. Email Service Integration Options

**Option A: Direct Resend Integration**
```javascript
// Add to auth.ts
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'YC Empire Links <noreply@ycempire.studio>',
    to: [email],
    subject: emailTemplate.subject,
    html: emailTemplate.html
  })
});
```

**Option B: Backend Email Service**
- Create a backend API endpoint
- Handle email sending server-side
- Better for security and rate limiting

### 2. Vercel Configuration

The `vercel.json` file is configured for:
- SPA routing for React app
- Ready for serverless functions when needed

### 3. Environment Variables (when ready)

Add these to your deployment:

```bash
RESEND_API_KEY=your_resend_api_key_here
```

## 🚀 Deployment Steps

### 1. Set up Resend Account

1. Go to [Resend.com](https://resend.com)
2. Create an account
3. Verify your domain (ycempire.studio)
4. Get your API key

### 2. Configure Vercel

1. Deploy the app to Vercel
2. Add the `RESEND_API_KEY` environment variable
3. Ensure the domain is verified in Resend

### 3. Test Email Functionality

1. Sign up for a new account
2. Check that confirmation email is sent
3. Complete onboarding
4. Verify welcome email is received

## 📱 Email Preview

For development and testing, use the EmailPreview component:

```typescript
import { EmailPreview } from '@/components/EmailPreview';

// Use in development to preview email templates
<EmailPreview />
```

## 🔍 Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check RESEND_API_KEY is set correctly
   - Verify domain is verified in Resend
   - Check Vercel function logs

2. **Email in spam folder**
   - Ensure domain authentication (SPF, DKIM, DMARC)
   - Use verified sender domain
   - Avoid spam trigger words

3. **Template not rendering**
   - Check HTML syntax in email templates
   - Test with different email clients
   - Verify image URLs are accessible

### Debug Mode

In development, emails are logged to console:

```javascript
console.log('Email would be sent:', {
  subject: emailTemplate.subject,
  to: userEmail,
  template: 'welcome'
});
```

## 📊 Email Analytics

Consider adding email tracking:
- Open rates
- Click-through rates
- Bounce rates
- Unsubscribe rates

## 🔒 Security Considerations

- Email confirmation links expire in 24 hours
- Use HTTPS for all links
- Implement rate limiting for email sending
- Validate email addresses before sending
- Include unsubscribe links (for marketing emails)

## 🎯 Best Practices

1. **Deliverability**
   - Use verified sender domain
   - Implement proper authentication
   - Monitor sender reputation

2. **Design**
   - Keep emails under 600px wide
   - Use web-safe fonts
   - Include alt text for images
   - Test across email clients

3. **Content**
   - Clear, concise subject lines
   - Personalized content
   - Strong call-to-action
   - Mobile-friendly design

## 📈 Future Enhancements

- Email templates for password reset
- Marketing email campaigns
- Email preferences management
- A/B testing for email content
- Advanced analytics and tracking
- Multi-language support

---

For questions or issues, contact the development team or check the Resend documentation.
