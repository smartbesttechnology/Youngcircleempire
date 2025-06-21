
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-amber-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <img 
            src="https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png" 
            alt="Young Circle Empire" 
            className="mx-auto mb-8 h-32 w-auto"
          />
          <h1 className="text-6xl font-bold text-white mb-4">
            Young Circle Empire
          </h1>
          <p className="text-xl text-amber-400 mb-8">
            Where creativity meets class
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Whether you're pulling up for a mic drop moment, a cinematic shoot, 
            or a full-blown artist experience — you're in the right place. 
            Let's make something legendary.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="bg-black/80 border-amber-500/30 hover:border-amber-500 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-white mb-4">Studio Bookings</h3>
              <p className="text-gray-300 mb-6">
                Music recording, video shoots, podcast sessions, and premium artist packages
              </p>
              <Button 
                onClick={() => navigate('/bookings')}
                className="bg-amber-600 hover:bg-amber-700 text-black font-bold px-8 py-3"
              >
                Book Studio Session
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/80 border-teal-500/30 hover:border-teal-500 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-2xl font-bold text-white mb-4">Equipment Rentals</h3>
              <p className="text-gray-300 mb-6">
                Professional cameras, gimbals, lighting, and all the gear you need
              </p>
              <Button 
                onClick={() => navigate('/rentals')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3"
              >
                Rent Equipment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Access */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline"
            className="border-gray-600 text-gray-400 hover:text-white hover:border-white"
          >
            Admin Access
          </Button>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <p>Follow us: @ycempire.studio</p>
          <p className="mt-2">Young Circle Empire © 2024</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
