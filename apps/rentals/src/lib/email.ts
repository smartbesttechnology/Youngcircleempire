/**
 * Email utility functions for sending rental confirmation emails
 */

interface RentalEmailData {
  customerName: string;
  customerEmail: string;
  equipment: string[];
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  notes?: string;
}

/**
 * Sends a rental confirmation email to the customer
 */
export async function sendRentalConfirmationEmail(data: RentalEmailData): Promise<boolean> {
  try {
    console.log("🚀 Starting rental email send process...");
    console.log("📧 Rental email data:", data);
    
    const equipmentText = data.equipment.join(", ");
    
    // Generate email HTML content
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #000; color: #fff; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="color: #14b8a6; margin: 0 0 20px 0; font-size: 24px;">📹 Young Circle Empire</h1>
          <h2 style="color: #fff; margin: 0 0 20px 0; font-size: 20px;">Equipment Rental Confirmation</h2>
        </div>
        
        <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #000; margin: 0 0 20px 0;">Hey ${data.customerName},</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Thanks for your equipment rental request for <strong style="color: #14b8a6;">${equipmentText}</strong> with Young Circle Empire.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #14b8a6; margin: 0 0 15px 0;">📅 Rental Details</h3>
            <p style="margin: 5px 0; color: #333;"><strong>Pickup Date:</strong> ${data.pickupDate}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Pickup Time:</strong> ${data.pickupTime}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Return Date:</strong> ${data.returnDate}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Return Time:</strong> ${data.returnTime}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Equipment:</strong> ${equipmentText}</p>
            ${data.notes ? `<p style="margin: 5px 0; color: #333;"><strong>Notes:</strong> ${data.notes}</p>` : ''}
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

    // Send email via API route
    console.log("📧 Sending rental email via API route...");
    
    const response = await fetch('/api/send-rental-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        equipment: data.equipment,
        pickupDate: data.pickupDate,
        pickupTime: data.pickupTime,
        returnDate: data.returnDate,
        returnTime: data.returnTime,
        notes: data.notes
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Rental email API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return false;
    }

    const result = await response.json();
    
    if (result.success) {
      console.log("✅ Rental email sent successfully via API route!");
      console.log("📧 Email ID:", result.emailId);
      return true;
    } else {
      console.error("❌ Rental email sending failed:", result.error);
      return false;
    }
    
  } catch (error) {
    console.error("💥 Error sending rental email:", error);
    return false;
  }
}
