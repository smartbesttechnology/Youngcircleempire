// Get API key from environment variables (set via Vercel-Resend integration)
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
    console.log('📧 Rental email API route called...');
    console.log('🔑 Environment variables check:');
    console.log('- RESEND_API_KEY available:', RESEND_API_KEY ? 'Yes' : 'No');
    console.log('- RESEND_API_KEY length:', RESEND_API_KEY ? RESEND_API_KEY.length : 0);
    
    // Check if API key is available
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY environment variable is not set');
      console.error('💡 Make sure you have configured the Vercel-Resend integration');
      return res.status(500).json({ 
        success: false, 
        error: 'Email service not configured. RESEND_API_KEY environment variable is missing.' 
      });
    }

    const { customerName, customerEmail, equipment, pickupDate, pickupTime, returnDate, returnTime, notes } = req.body;

    console.log('📧 Rental email request data:', { customerName, customerEmail, equipment, pickupDate, pickupTime, returnDate, returnTime });
    
    // Validate required fields
    if (!customerName || !customerEmail || !equipment || !pickupDate || !pickupTime || !returnDate || !returnTime) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: customerName, customerEmail, equipment, pickupDate, pickupTime, returnDate, returnTime'
      });
    }

    // Generate email HTML
    const equipmentText = equipment.join(", ");
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #000; color: #fff; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="color: #14b8a6; margin: 0 0 20px 0; font-size: 24px;">📹 Young Circle Empire</h1>
          <h2 style="color: #fff; margin: 0 0 20px 0; font-size: 20px;">Equipment Rental Confirmation</h2>
        </div>
        
        <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #000; margin: 0 0 20px 0;">Hey ${customerName},</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Thanks for your equipment rental request for <strong style="color: #14b8a6;">${equipmentText}</strong> with Young Circle Empire.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #14b8a6; margin: 0 0 15px 0;">📅 Rental Details</h3>
            <p style="margin: 5px 0; color: #333;"><strong>Pickup Date:</strong> ${pickupDate}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Pickup Time:</strong> ${pickupTime}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Return Date:</strong> ${returnDate}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Return Time:</strong> ${returnTime}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Equipment:</strong> ${equipmentText}</p>
            ${notes ? `<p style="margin: 5px 0; color: #333;"><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 15px 0;">⚠️ Important Rental Information</h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>Security deposits are required for all equipment</li>
              <li>Equipment must be returned in original condition</li>
              <li>Late returns may incur additional charges</li>
              <li>Bring valid ID for equipment pickup</li>
            </ul>
          </div>
          
          <p style="color: #333; line-height: 1.6; margin: 20px 0;">
            We'll follow up with you on WhatsApp shortly to confirm availability and discuss deposit requirements. 
            In the meantime, feel free to reach us on <strong style="color: #14b8a6;">02013306246</strong> if you need anything.
          </p>
          
          <div style="border-top: 2px solid #14b8a6; padding-top: 20px; margin-top: 30px;">
            <p style="color: #666; margin: 0; font-style: italic;">– Team YC Empire Rentals</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>Young Circle Empire Studio | Lagos, Nigeria</p>
          <p>📞 02013306246 | 📧 rentals@ycempire.studio</p>
        </div>
      </div>
    `;

    // Send email via Resend API
    console.log('📡 Calling Resend API for rental email...');
    console.log('🔗 API URL: https://api.resend.com/emails');
    console.log('📧 From: Young Circle Empire <rentals@ycempire.studio>');
    console.log('📧 To:', customerEmail);
    
    const emailPayload = {
      from: 'Young Circle Empire <rentals@ycempire.studio>',
      to: customerEmail,
      subject: '📹 YC Empire Equipment Rental Confirmation',
      html: emailHTML,
    };
    
    console.log('📦 Rental email payload prepared');
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    console.log('📡 Resend API response status:', response.status);
    console.log('📡 Resend API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Resend API error details:');
      console.error('- Status:', response.status);
      console.error('- Status Text:', response.statusText);
      console.error('- Error Body:', errorText);
      
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to send rental email via Resend API',
        details: {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        }
      });
    }

    const result = await response.json();
    console.log('✅ Rental email sent successfully via Resend API!');
    console.log('📧 Email ID:', result.id);
    console.log('📧 Full response:', result);

    return res.status(200).json({ 
      success: true, 
      emailId: result.id,
      message: 'Rental email sent successfully'
    });

  } catch (error) {
    console.error('💥 Rental email API route error:', error);
    console.error('💥 Error stack:', error.stack);
    
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      type: 'server_error'
    });
  }
};
