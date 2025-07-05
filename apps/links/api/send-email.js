// Vercel serverless function for sending emails
// This integrates with Resend for email delivery

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html, text } = req.body;

    // Validate required fields
    if (!to || !subject || !html) {
      return res.status(400).json({ 
        error: 'Missing required fields: to, subject, html' 
      });
    }

    // Get Resend API key from environment variables
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return res.status(500).json({ 
        error: 'Email service not configured' 
      });
    }

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'YC Empire Links <noreply@ycempire.studio>',
        to: [to],
        subject: subject,
        html: html,
        text: text || undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(response.status).json({ 
        error: 'Failed to send email',
        details: data 
      });
    }

    console.log('Email sent successfully:', data.id);
    return res.status(200).json({ 
      success: true, 
      messageId: data.id 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
