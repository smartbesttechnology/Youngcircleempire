
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "https://ycempire.studio";
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-amber-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <CheckCircle className="mx-auto w-20 h-20 text-green-500 mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Thank You!</h1>
          <p className="text-xl text-amber-400 mb-6">
            Your request has been submitted successfully.
          </p>
        </div>

        <div className="bg-black/60 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">What happens next?</h2>
          <div className="space-y-3 text-gray-300">
            <p>✅ Our team will review your submission</p>
            <p>📞 We'll reach out via your preferred contact method</p>
            <p>📅 Together we'll finalize the details and schedule</p>
            <p>🎬 Get ready to create something legendary!</p>
          </div>
        </div>

        <div className="text-gray-400">
          <p className="mb-2">Need immediate assistance?</p>
          <p>Follow us: @ycempire.studio</p>
          <p className="mt-4 text-sm">Redirecting to main site in a few seconds...</p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
