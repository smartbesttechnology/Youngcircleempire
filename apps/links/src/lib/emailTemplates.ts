// Email templates for YC Empire Links

export const getEmailConfirmationTemplate = (confirmationUrl: string) => {
  return {
    subject: "Confirm Your Email - YC Empire Links",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Email</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .email-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .logo img {
            width: 50px;
            height: 50px;
            object-fit: contain;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            color: rgba(255, 255, 255, 0.9);
            margin: 10px 0 0;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .content h2 {
            color: #1F2937;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 20px;
        }
        .content p {
            color: #6B7280;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 30px;
        }
        .confirm-button {
            display: inline-block;
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
            transition: transform 0.2s ease;
        }
        .confirm-button:hover {
            transform: translateY(-2px);
        }
        .footer {
            background: #F9FAFB;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
        }
        .footer p {
            color: #9CA3AF;
            font-size: 14px;
            margin: 0;
        }
        .footer a {
            color: #8B5CF6;
            text-decoration: none;
        }
        .security-note {
            background: #FEF3C7;
            border: 1px solid #F59E0B;
            border-radius: 8px;
            padding: 16px;
            margin: 30px 0;
        }
        .security-note p {
            color: #92400E;
            font-size: 14px;
            margin: 0;
        }
        @media (max-width: 600px) {
            .container {
                padding: 20px 10px;
            }
            .header, .content, .footer {
                padding: 30px 20px;
            }
            .header h1 {
                font-size: 24px;
            }
            .content h2 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-card">
            <div class="header">
                <div class="logo">
                    <img src="https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png" alt="YC Empire Logo">
                </div>
                <h1>YC Empire Links</h1>
                <p>Your creative bio link platform</p>
            </div>
            
            <div class="content">
                <h2>Confirm Your Email Address</h2>
                <p>Welcome to YC Empire Links! We're excited to have you join our creative community. To get started and secure your account, please confirm your email address by clicking the button below.</p>
                
                <a href="${confirmationUrl}" class="confirm-button">Confirm Email Address</a>
                
                <div class="security-note">
                    <p><strong>Security Note:</strong> This link will expire in 24 hours for your security. If you didn't create an account with YC Empire Links, you can safely ignore this email.</p>
                </div>
                
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #8B5CF6; font-family: monospace; font-size: 14px;">${confirmationUrl}</p>
            </div>
            
            <div class="footer">
                <p>This email was sent by <a href="https://ycempire.studio">YC Empire Studio</a></p>
                <p>If you have any questions, contact us at <a href="mailto:support@ycempire.studio">support@ycempire.studio</a></p>
            </div>
        </div>
    </div>
</body>
</html>
    `,
    text: `
YC Empire Links - Confirm Your Email

Welcome to YC Empire Links! 

To complete your account setup, please confirm your email address by visiting:
${confirmationUrl}

This link will expire in 24 hours for your security.

If you didn't create an account with YC Empire Links, you can safely ignore this email.

---
YC Empire Studio
https://ycempire.studio
support@ycempire.studio
    `
  };
};

export const getWelcomeEmailTemplate = (username: string, profileUrl: string) => {
  return {
    subject: "Welcome to YC Empire Links! 🎉",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to YC Empire Links</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .email-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .logo img {
            width: 50px;
            height: 50px;
            object-fit: contain;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            color: rgba(255, 255, 255, 0.9);
            margin: 10px 0 0;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
        }
        .welcome-message {
            text-align: center;
            margin-bottom: 40px;
        }
        .welcome-message h2 {
            color: #1F2937;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 15px;
        }
        .welcome-message p {
            color: #6B7280;
            font-size: 16px;
            line-height: 1.6;
            margin: 0;
        }
        .profile-info {
            background: #F3F4F6;
            border-radius: 12px;
            padding: 24px;
            margin: 30px 0;
            text-align: center;
        }
        .profile-info h3 {
            color: #1F2937;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 10px;
        }
        .profile-url {
            background: white;
            border: 2px solid #E5E7EB;
            border-radius: 8px;
            padding: 12px;
            font-family: monospace;
            font-size: 14px;
            color: #8B5CF6;
            word-break: break-all;
            margin: 10px 0;
        }
        .action-buttons {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 16px;
            margin: 0 10px 10px;
            transition: transform 0.2s ease;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .button-primary {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        .button-secondary {
            background: white;
            color: #8B5CF6;
            border: 2px solid #8B5CF6;
        }
        .features {
            margin: 40px 0;
        }
        .features h3 {
            color: #1F2937;
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 20px;
            text-align: center;
        }
        .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .feature-item {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #E5E7EB;
        }
        .feature-item:last-child {
            border-bottom: none;
        }
        .feature-icon {
            width: 24px;
            height: 24px;
            background: #8B5CF6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .feature-text {
            color: #4B5563;
            font-size: 15px;
        }
        .footer {
            background: #F9FAFB;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
        }
        .footer p {
            color: #9CA3AF;
            font-size: 14px;
            margin: 0 0 10px;
        }
        .footer a {
            color: #8B5CF6;
            text-decoration: none;
        }
        @media (max-width: 600px) {
            .container {
                padding: 20px 10px;
            }
            .header, .content, .footer {
                padding: 30px 20px;
            }
            .header h1 {
                font-size: 24px;
            }
            .welcome-message h2 {
                font-size: 20px;
            }
            .button {
                display: block;
                margin: 10px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-card">
            <div class="header">
                <div class="logo">
                    <img src="https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png" alt="YC Empire Logo">
                </div>
                <h1>YC Empire Links</h1>
                <p>Your creative bio link platform</p>
            </div>
            
            <div class="content">
                <div class="welcome-message">
                    <h2>Welcome to the YC Empire family! 🎉</h2>
                    <p>Congratulations on creating your YC Empire Links profile! You're now part of a creative community that's all about showcasing talent and connecting with audiences.</p>
                </div>
                
                <div class="profile-info">
                    <h3>Your Profile is Ready!</h3>
                    <p>Your unique bio link is now live at:</p>
                    <div class="profile-url">${profileUrl}</div>
                    <p>Share this link everywhere to showcase your content and connect with your audience!</p>
                </div>
                
                <div class="action-buttons">
                    <a href="${profileUrl}" class="button button-primary">View Your Profile</a>
                    <a href="https://links.ycempire.studio/dashboard" class="button button-secondary">Manage Links</a>
                </div>
                
                <div class="features">
                    <h3>What you can do with YC Empire Links:</h3>
                    <ul class="feature-list">
                        <li class="feature-item">
                            <div class="feature-icon">🔗</div>
                            <div class="feature-text">Add unlimited links to your social media, music, videos, and more</div>
                        </li>
                        <li class="feature-item">
                            <div class="feature-icon">🎨</div>
                            <div class="feature-text">Customize your profile with themes, bio, and profile picture</div>
                        </li>
                        <li class="feature-item">
                            <div class="feature-icon">📱</div>
                            <div class="feature-text">Mobile-optimized design that looks great on any device</div>
                        </li>
                        <li class="feature-item">
                            <div class="feature-icon">👁️</div>
                            <div class="feature-text">Control which links are visible to your audience</div>
                        </li>
                        <li class="feature-item">
                            <div class="feature-icon">⚡</div>
                            <div class="feature-text">Fast loading and SEO-friendly for maximum reach</div>
                        </li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                    <p style="color: #6B7280; font-size: 16px; margin: 0;">Ready to start building your online presence?</p>
                </div>
            </div>
            
            <div class="footer">
                <p>Welcome to <a href="https://ycempire.studio">YC Empire Studio</a> - Where creativity meets technology</p>
                <p>Need help? Contact us at <a href="mailto:support@ycempire.studio">support@ycempire.studio</a></p>
                <p>Follow us: <a href="#">Instagram</a> | <a href="#">TikTok</a> | <a href="#">Twitter</a></p>
            </div>
        </div>
    </div>
</body>
</html>
    `,
    text: `
Welcome to YC Empire Links! 🎉

Congratulations @${username}! Your YC Empire Links profile is now live.

Your unique bio link: ${profileUrl}

What you can do:
• Add unlimited links to your content
• Customize your profile with themes and bio
• Control link visibility
• Mobile-optimized design
• Fast loading and SEO-friendly

Get started:
- View your profile: ${profileUrl}
- Manage your links: https://links.ycempire.studio/dashboard

Welcome to the YC Empire family!

---
YC Empire Studio
https://ycempire.studio
support@ycempire.studio
    `
  };
};
