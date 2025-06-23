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
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactMethod: string;
  services: string[];
  date: string;
  time: string;
  duration: string;
  people: string;
  notes: string;
}

const BookingForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    contactMethod: "",
    services: [],
    date: "",
    time: "",
    duration: "",
    people: "",
    notes: "",
  });

  // Service data
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
      !formData.firstName ||
      !formData.lastName ||
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-amber-900">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Service Selection - First as requested */}
          <Card className="bg-black/80 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl">
                Step Into the Empire – Complete Your Booking
              </CardTitle>
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

          {/* Client Information - Restructured to match screenshot */}
          <Card className="bg-black/80 border-amber-500/30">
            <CardContent className="pt-6 space-y-4">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-white">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-white">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>

              {/* Phone Number with Country Code */}
              <div>
                <Label htmlFor="phone" className="text-white">
                  Phone Number *
                </Label>
                <div className="flex gap-2">
                  <Select defaultValue="NG">
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NG">🇳🇬 +234</SelectItem>
                      <SelectItem value="US">🇺🇸 +1</SelectItem>
                      <SelectItem value="UK">🇬🇧 +44</SelectItem>
                      <SelectItem value="CA">🇨🇦 +1</SelectItem>
                      <SelectItem value="AU">🇦🇺 +61</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="flex-1 bg-gray-800 border-gray-600 text-white"
                    placeholder="1234567890"
                    required
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <Label className="text-white">Preferred Contact Method</Label>
                <RadioGroup
                  value={formData.contactMethod}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, contactMethod: value }))
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
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
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
                      setFormData((prev) => ({ ...prev, time: e.target.value }))
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
                      setFormData((prev) => ({ ...prev, duration: value }))
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
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Tell us about your vision, concept, or any special requirements..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Terms & Conditions - Exact text as provided */}
          <Card className="bg-black/80 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-white">
                Young Circle Empire Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-white text-sm space-y-4">
                <p>
                  These Terms & Conditions govern all studio session bookings,
                  including music recording, video shoots, Empire Mic Sessions,
                  photoshoots, podcast sessions, and other creative bookings.
                </p>

                <div>
                  <h4 className="text-amber-400 font-semibold">
                    1. Booking & Payments
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>
                      All bookings must be made via our official channels or
                      website.
                    </li>
                    <li>
                      A minimum 50% deposit is required to confirm your booking.
                    </li>
                    <li>Balance must be paid before your session begins.</li>
                    <li>Bookings without deposit are not guaranteed.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-amber-400 font-semibold">
                    2. Cancellations & Rescheduling
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>
                      You may reschedule once if notice is given 48 hours in
                      advance.
                    </li>
                    <li>
                      Cancellations less than 48 hours to your session will
                      forfeit the deposit.
                    </li>
                    <li>No-shows are non-refundable.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-amber-400 font-semibold">
                    3. Studio Session Rules
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>
                      Your time slot starts and ends at the scheduled hours
                      regardless of your arrival time.
                    </li>
                    <li>Arriving 15 minutes early is encouraged to set up.</li>
                    <li>
                      You may extend your time if available, billed by the hour.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-amber-400 font-semibold">
                    4. Guests & Conduct
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>Maximum guest number is defined per session type.</li>
                    <li>
                      No fighting, illegal substances, or disruptive behavior
                      allowed.
                    </li>
                    <li>
                      We reserve the right to end a session without refund if
                      these rules are violated.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-amber-400 font-semibold">
                    5. Use of Content
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>
                      Unless agreed otherwise, you retain full ownership of your
                      work.
                    </li>
                    <li>
                      We may request to post BTS or highlights for promotion
                      unless you opt out beforehand.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-amber-400 font-semibold">
                    6. Damage & Liability
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>
                      You are responsible for any damage caused to studio
                      property.
                    </li>
                    <li>
                      Young Circle Empire is not liable for loss of personal
                      items or injury during your session.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-6">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-white">
                  I accept the Terms and Conditions
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold py-3 text-lg mt-6"
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
