const RESEND_API_KEY = process.env.RESEND_API_KEY;

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if API key is available
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY environment variable is not set');
      return res.status(500).json({
        success: false,
        error: 'Email service not configured. Please set RESEND_API_KEY environment variable.'
      });
    }

    const { customerName, customerEmail, services, bookingDate, bookingTime, notes } = req.body;

    console.log('📧 Sending email via Vercel API route...');
    console.log('Email data:', { customerName, customerEmail, services, bookingDate, bookingTime });
    console.log('🔑 API Key available:', RESEND_API_KEY ? 'Yes' : 'No');

    // Generate email HTML
    const servicesText = services.join(", ");
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #000; color: #fff; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="color: #f59e0b; margin: 0 0 20px 0; font-size: 24px;">🎙️ Young Circle Empire</h1>
          <h2 style="color: #fff; margin: 0 0 20px 0; font-size: 20px;">Booking Confirmation</h2>
        </div>
        
        <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #000; margin: 0 0 20px 0;">Hey ${customerName},</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Thanks for booking <strong style="color: #f59e0b;">${servicesText}</strong> with Young Circle Empire.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f59e0b; margin: 0 0 15px 0;">📅 Session Details</h3>
            <p style="margin: 5px 0; color: #333;"><strong>Date:</strong> ${bookingDate}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Time:</strong> ${bookingTime}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Service(s):</strong> ${servicesText}</p>
            ${notes ? `<p style="margin: 5px 0; color: #333;"><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>
          
          <p style="color: #333; line-height: 1.6; margin: 20px 0;">
            We'll follow up with you on WhatsApp shortly. In the meantime, feel free to reach us on 
            <strong style="color: #f59e0b;">02013306246</strong> if you need anything.
          </p>
          
          <div style="border-top: 2px solid #f59e0b; padding-top: 20px; margin-top: 30px;">
            <p style="color: #666; margin: 0; font-style: italic;">– Team YC Empire</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>Young Circle Empire Studio | Lagos, Nigeria</p>
          <p>📞 02013306246 | 📧 bookings@ycempire.studio</p>
        </div>
      </div>
    `;

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Young Circle Empire <bookings@ycempire.studio>',
        to: customerEmail,
        subject: '🎙️ YC Empire Booking Confirmation',
        html: emailHTML,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Resend API error:', errorText);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to send email',
        details: errorText 
      });
    }

    const result = await response.json();
    console.log('✅ Email sent successfully:', result);

    return res.status(200).json({ 
      success: true, 
      emailId: result.id 
    });

  } catch (error) {
    console.error('💥 Vercel API route error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
