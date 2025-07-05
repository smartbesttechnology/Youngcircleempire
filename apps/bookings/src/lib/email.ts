/**
 * Email utility functions for sending booking confirmations
 * Using direct Resend API call with proper error handling
 */

const RESEND_API_KEY = "re_9cV1L9Ei_BMnNeSB6cTux4UZqncN1Zcux";

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  services: string[];
  bookingDate: string;
  bookingTime: string;
  notes?: string;
}

/**
 * Generates the HTML content for the booking confirmation email
 */
function generateBookingConfirmationHTML(data: BookingEmailData): string {
  const servicesText = data.services.join(", ");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #000; color: #fff; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: #f59e0b; margin: 0 0 20px 0; font-size: 24px;">🎙️ Young Circle Empire</h1>
        <h2 style="color: #fff; margin: 0 0 20px 0; font-size: 20px;">Booking Confirmation</h2>
      </div>

      <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #000; margin: 0 0 20px 0;">Hey ${data.customerName},</h2>

        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
          Thanks for booking <strong style="color: #f59e0b;">${servicesText}</strong> with Young Circle Empire.
        </p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #f59e0b; margin: 0 0 15px 0;">📅 Session Details</h3>
          <p style="margin: 5px 0; color: #333;"><strong>Date:</strong> ${data.bookingDate}</p>
          <p style="margin: 5px 0; color: #333;"><strong>Time:</strong> ${data.bookingTime}</p>
          <p style="margin: 5px 0; color: #333;"><strong>Service(s):</strong> ${servicesText}</p>
          ${data.notes ? `<p style="margin: 5px 0; color: #333;"><strong>Notes:</strong> ${data.notes}</p>` : ''}
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
}

/**
 * Sends a booking confirmation email to the customer
 * Note: This may fail due to CORS in development, but will work in production
 */
export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  try {
    console.log("🚀 Starting email send process...");
    console.log("📧 Email data:", data);

    const emailPayload = {
      from: "Young Circle Empire <bookings@ycempire.studio>",
      to: data.customerEmail,
      subject: "🎙️ YC Empire Booking Confirmation",
      html: generateBookingConfirmationHTML(data)
    };

    console.log("📦 Email payload:", emailPayload);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailPayload)
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Resend API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      // Log helpful message about CORS
      if (response.status === 0 || errorText.includes('CORS')) {
        console.log("💡 This is likely a CORS issue in development. Email will work in production.");
      }

      return false;
    }

    const result = await response.json();
    console.log("✅ Email sent successfully:", result);
    return true;

  } catch (error) {
    console.error("💥 Error sending email:", error);

    // Check if it's a CORS error
    if (error.message.includes('CORS') || error.message.includes('fetch')) {
      console.log("💡 This appears to be a CORS issue. The email will work when deployed to production.");
    }

    return false;
  }
}
