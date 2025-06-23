import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import BookingConfirmationModal from "@/components/BookingConfirmationModal";
interface BookingData {
  fullName: string;
  phone: string;
  email: string;
  contactMethod: string;
  services: string[];
  addons: string[];
  date: string;
  time: string;
  duration: string;
  people: string;
  notes: string;
  paymentMethod: string;
}
const BookingForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<BookingData>({
    fullName: "",
    phone: "",
    email: "",
    contactMethod: "",
    services: [],
    addons: [],
    date: "",
    time: "",
    duration: "",
    people: "",
    notes: "",
    paymentMethod: "",
  });

  // Mock data - in real app, this would come from Supabase
  const services = [
    // Studio Sessions
    {
      id: "music-recording",
      name: "Music Recording",
      category: "Studio Sessions",
      info: "Contact for pricing details",
    },
    {
      id: "empire-mic",
      name: "Empire Mic Session",
      category: "Studio Sessions",
      info: "Contact for pricing details",
    },
    {
      id: "podcast",
      name: "Podcast Recording",
      category: "Studio Sessions",
      info: "Contact for pricing details",
    },
    // Visuals & Shoots
    {
      id: "music-video",
      name: "Music Video",
      category: "Visuals & Shoots",
      info: "Request custom quote",
    },
    {
      id: "photoshoot",
      name: "Photoshoot",
      category: "Visuals & Shoots",
      info: "Pricing varies by package",
    },
    {
      id: "studio-rental",
      name: "Studio Rental",
      category: "Visuals & Shoots",
      info: "Hourly and daily rates available",
    },
    {
      id: "recording-shoot",
      name: "Recording Shoot",
      category: "Visuals & Shoots",
      info: "Contact for pricing details",
    },
    // Premium Packages
    {
      id: "empire-platinum",
      name: "Empire Platinum Package",
      category: "Premium Artist Packages",
      info: "Premium all-inclusive pricing",
    },
    {
      id: "full-circle",
      name: "Full Circle Artist Package",
      category: "Premium Artist Packages",
      info: "Complete package pricing available",
    },
    {
      id: "dj-booking",
      name: "House Party DJ Booking Package",
      category: "Premium Artist Packages",
      info: "Event-based pricing",
    },
  ];

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      services: checked
        ? [...prev.services, serviceId]
        : prev.services.filter((id) => id !== serviceId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      formData.services.length === 0
    ) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(true);
  };
  const handleConfirmBooking = async () => {
    try {
      // Here you would save to Supabase and send emails
      console.log("Booking confirmed:", formData);
      toast({
        title: "Booking Confirmed!",
        description: "We'll be in touch soon to finalize your session.",
      });
      setShowConfirmation(false);
      navigate("/thank-you");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  const hasSelectedServices = formData.services.length > 0;
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-amber-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src="https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png"
            alt="Young Circle Empire"
            className="mx-auto mb-6 h-20 w-auto"
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            Empire Bookings
          </h1>
          <p className="text-amber-400 max-w-3xl mx-auto text-lg">
            Where creativity meets class. Whether you're pulling up for a mic
            drop moment, a cinematic shoot, or a full-blown artist experience,
            you're in the right place. Let's make something legendary.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Client Information */}
          <Card className="bg-black/80 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-white">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-white">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-white">Preferred Contact Method</Label>
                <RadioGroup
                  value={formData.contactMethod}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactMethod: value,
                    }))
                  }
                  className="flex flex-row space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="whatsapp" id="whatsapp" />
                    <Label htmlFor="whatsapp" className="text-white">
                      WhatsApp
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="call" id="call" />
                    <Label htmlFor="call" className="text-white">
                      Call
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Service Selection */}
          <Card className="bg-black/80 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-white">Service Selection</CardTitle>
            </CardHeader>
            <CardContent>
              {[
                "Studio Sessions",
                "Visuals & Shoots",
                "Premium Artist Packages",
              ].map((category) => (
                <div key={category} className="mb-6">
                  <h3 className="text-amber-400 font-semibold mb-3">
                    {category === "Studio Sessions" && "🎙️ "}
                    {category === "Visuals & Shoots" && "🎥 "}
                    {category === "Premium Artist Packages" && "👑 "}
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services
                      .filter((service) => service.category === category)
                      .map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg"
                        >
                          <Checkbox
                            id={service.id}
                            checked={formData.services.includes(service.id)}
                            onCheckedChange={(checked) =>
                              handleServiceChange(
                                service.id,
                                checked as boolean,
                              )
                            }
                          />
                          <Label
                            htmlFor={service.id}
                            className="text-white flex-1"
                          >
                            {service.name}
                            <span className="text-amber-400 block text-sm">
                              {service.info}
                            </span>
                          </Label>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="bg-black/80 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-white">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-white">
                    Preferred Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-white">
                    Start Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration" className="text-white">
                    Duration
                  </Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: value,
                      }))
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-hour">1 hour</SelectItem>
                      <SelectItem value="2-hours">2 hours</SelectItem>
                      <SelectItem value="3-hours">3 hours</SelectItem>
                      <SelectItem value="4-hours">4 hours</SelectItem>
                      <SelectItem value="full-day">Full Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="people" className="text-white">
                    Number of People
                  </Label>
                  <Input
                    id="people"
                    type="number"
                    value={formData.people}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        people: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes" className="text-white">
                  Notes / Concepts
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Tell us about your vision, concept, or any special requirements..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          {hasSelectedServices && (
            <Card className="bg-black/80 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-white">
                  Pricing & Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-white">
                  <p className="text-amber-400 font-semibold mb-2">
                    💰 Pricing Details
                  </p>
                  <p className="text-gray-300 mb-4">
                    Our pricing varies based on your specific needs, duration,
                    and package selection. We'll provide you with a detailed
                    quote after reviewing your booking request.
                  </p>

                  <p className="text-amber-400 font-semibold mb-2">
                    📞 What Happens Next
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• We'll review your request within 24 hours</li>
                    <li>• Our team will contact you with pricing details</li>
                    <li>• We'll schedule your session once confirmed</li>
                    <li>
                      • Payment options will be discussed during confirmation
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Terms & Submit */}
          <Card className="bg-black/80 border-amber-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-white">
                  I agree to the studio terms and conditions
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold py-3 text-lg"
              >
                Submit Booking Request
              </Button>
            </CardContent>
          </Card>
        </form>

        <BookingConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmBooking}
          bookingData={formData}
          services={services}
        />
      </div>
    </div>
  );
};
export default BookingForm;
