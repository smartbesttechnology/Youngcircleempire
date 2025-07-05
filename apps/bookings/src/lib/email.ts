/**
 * Email utility functions for sending booking confirmations via Supabase Email
 * Using Supabase's email service with Resend integration
 */

import { supabase } from './supabase';

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  services: string[];
  bookingDate: string;
  bookingTime: string;
  notes?: string;
}

/**
 * Sends a booking confirmation email to the customer via Supabase Email
 * This uses Supabase's email service which is integrated with Resend
 */
export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  try {
    console.log("🚀 Starting email send process via Supabase Email...");
    console.log("📧 Email data:", data);

    const servicesText = data.services.join(", ");

    // Generate email HTML content
    const emailHTML = `
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

    // Since you've integrated Resend with Supabase, let's try using the Vercel API route
    // but with better error handling for the Supabase integration
    console.log("📧 Sending email via Vercel API route (with Supabase-Resend integration)...");

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        services: data.services,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
        notes: data.notes
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Email API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return false;
    }

    const result = await response.json();

    if (result.success) {
      console.log("✅ Email sent successfully via API route!");
      console.log("📧 Email ID:", result.emailId);
      return true;
    } else {
      console.error("❌ Email sending failed:", result.error);
      return false;
    }

  } catch (error) {
    console.error("💥 Error sending email via Supabase:", error);
    return false;
  }
}
