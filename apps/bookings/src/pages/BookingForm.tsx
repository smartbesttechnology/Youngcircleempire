import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const {
    toast
  } = useToast();
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
    paymentMethod: ""
  });

  // Mock data - in real app, this would come from Supabase
  const services = [
  // Studio Sessions
  {
    id: "music-recording",
    name: "Music Recording",
    category: "Studio Sessions",
    price: 50000
  }, {
    id: "empire-mic",
    name: "Empire Mic Session",
    category: "Studio Sessions",
    price: 35000
  }, {
    id: "podcast",
    name: "Podcast Recording",
    category: "Studio Sessions",
    price: 30000
  },
  // Visuals & Shoots
  {
    id: "music-video",
    name: "Music Video",
    category: "Visuals & Shoots",
    price: 150000
  }, {
    id: "photoshoot",
    name: "Photoshoot",
    category: "Visuals & Shoots",
    price: 80000
  }, {
    id: "studio-rental",
    name: "Studio Rental",
    category: "Visuals & Shoots",
    price: 25000
  }, {
    id: "recording-shoot",
    name: "Recording Shoot",
    category: "Visuals & Shoots",
    price: 100000
  },
  // Premium Packages
  {
    id: "empire-platinum",
    name: "Empire Platinum Package",
    category: "Premium Artist Packages",
    price: 300000
  }, {
    id: "full-circle",
    name: "Full Circle Artist Package",
    category: "Premium Artist Packages",
    price: 500000
  }, {
    id: "dj-booking",
    name: "House Party DJ Booking Package",
    category: "Premium Artist Packages",
    price: 200000
  }];
  const addons = [{
    id: "bts-video",
    name: "Behind-the-Scenes Video",
    price: 50000
  }, {
    id: "extra-lighting",
    name: "Extra Lighting",
    price: 25000
  }, {
    id: "changing-room",
    name: "Changing Room Access",
    price: 15000
  }, {
    id: "private-room",
    name: "Private Room (Overnight)",
    price: 100000
  }];
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };
  const calculateTotal = () => {
    let total = 0;
    formData.services.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (service) total += service.price;
    });
    formData.addons.forEach(addonId => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) total += addon.price;
    });
    return total;
  };
  const handleServiceChange = (serviceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked ? [...prev.services, serviceId] : prev.services.filter(id => id !== serviceId)
    }));
  };
  const handleAddonChange = (addonId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      addons: checked ? [...prev.addons, addonId] : prev.addons.filter(id => id !== addonId)
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || formData.services.length === 0) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
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
        description: "We'll be in touch soon to finalize your session."
      });
      setShowConfirmation(false);
      navigate('/thank-you');
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };
  const total = calculateTotal();
  const hasPayableServices = total > 0;
  return <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-amber-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <img src="https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png" alt="Young Circle Empire" className="mx-auto mb-6 h-20 w-auto" />
          <h1 className="text-4xl font-bold text-white mb-4">Empire Bookings</h1>
          <p className="text-amber-400 max-w-3xl mx-auto text-lg">Where creativity meets class. Whether you're pulling up for a mic drop moment, a cinematic shoot, or a full-blown artist experience, you're in the right place. Let's make something legendary.</p>
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
                  <Label htmlFor="fullName" className="text-white">Full Name *</Label>
                  <Input id="fullName" value={formData.fullName} onChange={e => setFormData(prev => ({
                  ...prev,
                  fullName: e.target.value
                }))} className="bg-gray-800 border-gray-600 text-white" required />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                  <Input id="phone" value={formData.phone} onChange={e => setFormData(prev => ({
                  ...prev,
                  phone: e.target.value
                }))} className="bg-gray-800 border-gray-600 text-white" required />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email Address *</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))} className="bg-gray-800 border-gray-600 text-white" required />
              </div>
              <div>
                <Label className="text-white">Preferred Contact Method</Label>
                <RadioGroup value={formData.contactMethod} onValueChange={value => setFormData(prev => ({
                ...prev,
                contactMethod: value
              }))} className="flex flex-row space-x-6 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="whatsapp" id="whatsapp" />
                    <Label htmlFor="whatsapp" className="text-white">WhatsApp</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="call" id="call" />
                    <Label htmlFor="call" className="text-white">Call</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="text-white">Email</Label>
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
              {["Studio Sessions", "Visuals & Shoots", "Premium Artist Packages"].map(category => <div key={category} className="mb-6">
                  <h3 className="text-amber-400 font-semibold mb-3">
                    {category === "Studio Sessions" && "🎙️ "}
                    {category === "Visuals & Shoots" && "🎥 "}
                    {category === "Premium Artist Packages" && "👑 "}
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services.filter(service => service.category === category).map(service => <div key={service.id} className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg">
                        <Checkbox id={service.id} checked={formData.services.includes(service.id)} onCheckedChange={checked => handleServiceChange(service.id, checked as boolean)} />
                        <Label htmlFor={service.id} className="text-white flex-1">
                          {service.name}
                          <span className="text-amber-400 block text-sm">{formatPrice(service.price)}</span>
                        </Label>
                      </div>)}
                  </div>
                </div>)}
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
                  <Label htmlFor="date" className="text-white">Preferred Date</Label>
                  <Input id="date" type="date" value={formData.date} onChange={e => setFormData(prev => ({
                  ...prev,
                  date: e.target.value
                }))} className="bg-gray-800 border-gray-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="time" className="text-white">Start Time</Label>
                  <Input id="time" type="time" value={formData.time} onChange={e => setFormData(prev => ({
                  ...prev,
                  time: e.target.value
                }))} className="bg-gray-800 border-gray-600 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration" className="text-white">Duration</Label>
                  <Select value={formData.duration} onValueChange={value => setFormData(prev => ({
                  ...prev,
                  duration: value
                }))}>
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
                  <Label htmlFor="people" className="text-white">Number of People</Label>
                  <Input id="people" type="number" value={formData.people} onChange={e => setFormData(prev => ({
                  ...prev,
                  people: e.target.value
                }))} className="bg-gray-800 border-gray-600 text-white" min="1" />
                </div>
              </div>
              <div>
                <Label htmlFor="notes" className="text-white">Notes / Concepts</Label>
                <Textarea id="notes" value={formData.notes} onChange={e => setFormData(prev => ({
                ...prev,
                notes: e.target.value
              }))} className="bg-gray-800 border-gray-600 text-white" placeholder="Tell us about your vision, concept, or any special requirements..." />
              </div>
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card className="bg-black/80 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-white">Add-ons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {addons.map(addon => <div key={addon.id} className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg">
                    <Checkbox id={addon.id} checked={formData.addons.includes(addon.id)} onCheckedChange={checked => handleAddonChange(addon.id, checked as boolean)} />
                    <Label htmlFor={addon.id} className="text-white flex-1">
                      {addon.name}
                      <span className="text-amber-400 block text-sm">{formatPrice(addon.price)}</span>
                    </Label>
                  </div>)}
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          {hasPayableServices && <Card className="bg-black/80 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-white">Payment Options</CardTitle>
                <p className="text-amber-400">Total: {formatPrice(total)}</p>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.paymentMethod} onValueChange={value => setFormData(prev => ({
              ...prev,
              paymentMethod: value
            }))} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pay-now" id="pay-now" />
                    <Label htmlFor="pay-now" className="text-white">Pay Now (Online)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pay-studio" id="pay-studio" />
                    <Label htmlFor="pay-studio" className="text-white">Pay at Studio</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>}

          {/* Terms & Submit */}
          <Card className="bg-black/80 border-amber-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-white">
                  I agree to the studio terms and conditions
                </Label>
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold py-3 text-lg">
                Submit Booking Request
              </Button>
            </CardContent>
          </Card>
        </form>

        <BookingConfirmationModal isOpen={showConfirmation} onClose={() => setShowConfirmation(false)} onConfirm={handleConfirmBooking} bookingData={formData} services={services} addons={addons} total={total} />
      </div>
    </div>;
};
export default BookingForm;