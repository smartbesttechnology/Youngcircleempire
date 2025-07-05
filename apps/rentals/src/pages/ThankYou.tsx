import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add confetti effect or any other celebration animation here if needed
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <CheckCircle className="w-24 h-24 text-teal-400 animate-pulse" />
            <div className="absolute inset-0 w-24 h-24 border-4 border-teal-400/30 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Rental Request Submitted!
          </h1>
          <p className="text-xl text-teal-400 max-w-lg mx-auto">
            Thank you for choosing Young Circle Empire for your equipment rental needs.
          </p>
        </div>

        {/* Details Card */}
        <Card className="bg-black/80 border-teal-500/30 text-left">
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-teal-400 mb-4">
                What happens next?
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-white font-semibold">Equipment Availability Check</h3>
                  <p className="text-gray-300 text-sm">
                    We'll verify that your requested equipment is available for your selected dates.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-white font-semibold">WhatsApp Confirmation</h3>
                  <p className="text-gray-300 text-sm">
                    Our team will contact you via WhatsApp within 2 hours to confirm your rental and discuss deposit requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-white font-semibold">Pickup Arrangement</h3>
                  <p className="text-gray-300 text-sm">
                    We'll arrange the pickup details and provide you with our studio location and any special instructions.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-600 pt-6">
              <h3 className="text-teal-400 font-semibold mb-4">Need immediate assistance?</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:02013306246"
                  className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: 02013306246</span>
                </a>
                <a
                  href="https://wa.me/2348123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">📋 Important Reminders</h4>
              <ul className="text-yellow-200 text-sm space-y-1">
                <li>• Bring a valid government-issued ID for equipment pickup</li>
                <li>• Security deposits are required and will be refunded upon return</li>
                <li>• Equipment must be returned in the same condition as received</li>
                <li>• Late returns may incur additional daily charges</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-teal-500 text-teal-400 hover:bg-teal-900/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Make Another Rental
          </Button>
          <Button
            onClick={() => window.open("https://ycempire.studio", "_blank")}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Visit Our Website
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>Young Circle Empire Equipment Rentals</p>
          <p>Professional gear for creators and artists</p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
