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
  countryCode: string;
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
    firstName: "",
    lastName: "",
    phone: "",
    countryCode: "+234",
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
      price: 50000,
    },
    {
      id: "empire-mic",
      name: "Empire Mic Session",
      category: "Studio Sessions",
      price: 35000,
    },
    {
      id: "podcast",
      name: "Podcast Recording",
      category: "Studio Sessions",
      price: 30000,
    },
    // Visuals & Shoots
    {
      id: "music-video",
      name: "Music Video",
      category: "Visuals & Shoots",
      price: 150000,
    },
    {
      id: "photoshoot",
      name: "Photoshoot",
      category: "Visuals & Shoots",
      price: 80000,
    },
    {
      id: "studio-rental",
      name: "Studio Rental",
      category: "Visuals & Shoots",
      price: 25000,
    },
    {
      id: "recording-shoot",
      name: "Recording Shoot",
      category: "Visuals & Shoots",
      price: 100000,
    },
    // Premium Packages
    {
      id: "empire-platinum",
      name: "Empire Platinum Package",
      category: "Premium Artist Packages",
      price: 300000,
    },
    {
      id: "full-circle",
      name: "Full Circle Artist Package",
      category: "Premium Artist Packages",
      price: 500000,
    },
    {
      id: "dj-booking",
      name: "House Party DJ Booking Package",
      category: "Premium Artist Packages",
      price: 200000,
    },
  ];
  const addons = [
    {
      id: "bts-video",
      name: "Behind-the-Scenes Video",
      price: 50000,
    },
    {
      id: "extra-lighting",
      name: "Extra Lighting",
      price: 25000,
    },
    {
      id: "changing-room",
      name: "Changing Room Access",
      price: 15000,
    },
    {
      id: "private-room",
      name: "Private Room (Overnight)",
      price: 100000,
    },
  ];
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };
  const calculateTotal = () => {
    let total = 0;
    formData.services.forEach((serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      if (service) total += service.price;
    });
    formData.addons.forEach((addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      if (addon) total += addon.price;
    });
    return total;
  };
  const handleServiceChange = (serviceId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      services: checked
        ? [...prev.services, serviceId]
        : prev.services.filter((id) => id !== serviceId),
    }));
  };
  const handleAddonChange = (addonId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      addons: checked
        ? [...prev.addons, addonId]
        : prev.addons.filter((id) => id !== addonId),
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
  const total = calculateTotal();
  const hasPayableServices = total > 0;
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
                              {formatPrice(service.price)}
                            </span>
                          </Label>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card className="bg-black/80 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-white">Add-ons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {addons.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg"
                  >
                    <Checkbox
                      id={addon.id}
                      checked={formData.addons.includes(addon.id)}
                      onCheckedChange={(checked) =>
                        handleAddonChange(addon.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={addon.id} className="text-white flex-1">
                      {addon.name}
                      <span className="text-amber-400 block text-sm">
                        {formatPrice(addon.price)}
                      </span>
                    </Label>
                  </div>
                ))}
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

          {/* Client Information */}
          <Card className="bg-black/80 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-white">
                Step Into the Empire Complete Your Booking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div>
                <Label htmlFor="email" className="text-white">
                  Email *
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
                <Label className="text-white">Phone Number *</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.countryCode}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        countryCode: value,
                      }))
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+234">🇳🇬 +234</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+33">🇫🇷 +33</SelectItem>
                      <SelectItem value="+49">🇩🇪 +49</SelectItem>
                      <SelectItem value="+39">🇮🇹 +39</SelectItem>
                      <SelectItem value="+34">🇪🇸 +34</SelectItem>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+86">🇨🇳 +86</SelectItem>
                      <SelectItem value="+81">🇯🇵 +81</SelectItem>
                      <SelectItem value="+82">🇰🇷 +82</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61</SelectItem>
                      <SelectItem value="+55">🇧🇷 +55</SelectItem>
                      <SelectItem value="+52">🇲🇽 +52</SelectItem>
                      <SelectItem value="+27">🇿🇦 +27</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="1234567890"
                    className="bg-gray-800 border-gray-600 text-white flex-1"
                    required
                  />
                </div>
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

          {/* Payment Options */}
          {hasPayableServices && (
            <Card className="bg-black/80 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-white">Payment Options</CardTitle>
                <p className="text-amber-400">Total: {formatPrice(total)}</p>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: value,
                    }))
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pay-now" id="pay-now" />
                    <Label htmlFor="pay-now" className="text-white">
                      Pay Now (Online)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pay-studio" id="pay-studio" />
                    <Label htmlFor="pay-studio" className="text-white">
                      Pay at Studio
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Terms & Conditions */}
          <Card className="bg-black/80 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-white">
                Young Circle Empire Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Scrollable Terms Container */}
              <div className="border border-gray-600 rounded-lg p-4 mb-6 max-h-[240px] overflow-y-auto bg-gray-900/50">
                <div className="text-white text-sm leading-relaxed space-y-4">
                  <div>
                    <h3 className="text-amber-400 font-semibold mb-2">
                      YOUNG CIRCLE EMPIRE – BOOKING TERMS & CONDITIONS
                    </h3>
                    <p className="text-gray-300">
                      These Terms & Conditions govern all studio session
                      bookings, including music recording, video shoots, Empire
                      Mic Sessions, photoshoots, podcast sessions, and other
                      creative bookings.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-amber-400 font-medium mb-2">
                      1. Booking & Payments
                    </h4>
                    <ul className="space-y-1 text-gray-300 ml-4">
                      <li>
                        • All bookings must be made via our official channels or
                        website.
                      </li>
                      <li>
                        • A minimum 50% deposit is required to confirm your
                        booking.
                      </li>
                      <li>
                        • Balance must be paid before your session begins.
                      </li>
                      <li>• Bookings without deposit are not guaranteed.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-amber-400 font-medium mb-2">
                      2. Cancellations & Rescheduling
                    </h4>
                    <ul className="space-y-1 text-gray-300 ml-4">
                      <li>
                        • You may reschedule once if notice is given 48 hours in
                        advance.
                      </li>
                      <li>
                        • Cancellations less than 48 hours to your session will
                        forfeit the deposit.
                      </li>
                      <li>• No-shows are non-refundable.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-amber-400 font-medium mb-2">
                      3. Studio Session Rules
                    </h4>
                    <ul className="space-y-1 text-gray-300 ml-4">
                      <li>
                        • Your time slot starts and ends at the scheduled hours
                        regardless of your arrival time.
                      </li>
                      <li>
                        • Arriving 15 minutes early is encouraged to set up.
                      </li>
                      <li>
                        • You may extend your time if available, billed by the
                        hour.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-amber-400 font-medium mb-2">
                      4. Guests & Conduct
                    </h4>
                    <ul className="space-y-1 text-gray-300 ml-4">
                      <li>
                        • Maximum guest number is defined per session type.
                      </li>
                      <li>
                        • No fighting, illegal substances, or disruptive
                        behavior allowed.
                      </li>
                      <li>
                        • We reserve the right to end a session without refund
                        if these rules are violated.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-amber-400 font-medium mb-2">
                      5. Use of Content
                    </h4>
                    <ul className="space-y-1 text-gray-300 ml-4">
                      <li>
                        • Unless agreed otherwise, you retain full ownership of
                        your work.
                      </li>
                      <li>
                        • We may request to post BTS or highlights for promotion
                        unless you opt out beforehand.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-amber-400 font-medium mb-2">
                      6. Damage & Liability
                    </h4>
                    <ul className="space-y-1 text-gray-300 ml-4">
                      <li>
                        • You are responsible for any damage caused to studio
                        property.
                      </li>
                      <li>
                        • Young Circle Empire is not liable for loss of personal
                        items or injury during your session.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Terms Acceptance */}
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-white">
                  I accept the Terms and Conditions
                </Label>
              </div>

              {/* Submit Button */}
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
          addons={addons}
          total={total}
        />
      </div>
    </div>
  );
};
export default BookingForm;
