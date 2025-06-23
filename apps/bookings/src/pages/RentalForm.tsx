import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import RentalConfirmationModal from "@/components/RentalConfirmationModal";

interface RentalData {
  fullName: string;
  phone: string;
  email: string;
  contactMethod: string;
  equipment: string[];
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  notes: string;
}

const RentalForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<RentalData>({
    fullName: "",
    phone: "",
    email: "",
    contactMethod: "",
    equipment: [],
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    notes: "",
  });

  // Mock equipment data - in real app, this would come from Supabase
  const equipment = [
    {
      id: "sony-a1",
      name: "Sony Alpha A1",
      info: "Professional camera rental",
      requiresDeposit: true,
    },
    {
      id: "gimbal",
      name: "Professional Gimbal",
      info: "Stabilization equipment",
      requiresDeposit: true,
    },
    {
      id: "tripod",
      name: "Carbon Fiber Tripod",
      info: "Support equipment",
      requiresDeposit: false,
    },
    {
      id: "mic-set",
      name: "Wireless Mic Set",
      info: "Audio recording equipment",
      requiresDeposit: true,
    },
    {
      id: "led-lights",
      name: "LED Light Kit",
      info: "Professional lighting",
      requiresDeposit: true,
    },
    {
      id: "lens-24-70",
      name: "24-70mm F2.8 Lens",
      info: "Premium lens rental",
      requiresDeposit: true,
    },
    {
      id: "monitor",
      name: "External Monitor",
      info: "Display monitoring",
      requiresDeposit: true,
    },
    {
      id: "slider",
      name: "Camera Slider",
      info: "Smooth camera movement",
      requiresDeposit: true,
    },
  ];

  const handleEquipmentChange = (equipmentId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      equipment: checked
        ? [...prev.equipment, equipmentId]
        : prev.equipment.filter((id) => id !== equipmentId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      formData.equipment.length === 0
    ) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmRental = async () => {
    try {
      // Here you would save to Supabase and send emails
      console.log("Rental confirmed:", formData);

      toast({
        title: "Rental Request Submitted!",
        description: "We'll review your documents and contact you soon.",
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

  const hasSelectedEquipment = formData.equipment.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-teal-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src="https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png"
            alt="Young Circle Empire"
            className="mx-auto mb-6 h-20 w-auto"
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            Equipment Rentals
          </h1>
          <p className="text-teal-400 max-w-3xl mx-auto text-lg">
            🎥 Rent premium gear, shoot with confidence. From cameras to
            gimbals, get what you need to create magic — with protection in
            place.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Client Information */}
          <Card className="bg-slate-900/80 border-teal-500/30">
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
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
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

          {/* Equipment Selection */}
          <Card className="bg-slate-900/80 border-teal-500/30">
            <CardHeader>
              <CardTitle className="text-white">Equipment Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-3 p-4 bg-gray-800/50 rounded-lg"
                  >
                    <Checkbox
                      id={item.id}
                      checked={formData.equipment.includes(item.id)}
                      onCheckedChange={(checked) =>
                        handleEquipmentChange(item.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={item.id}
                        className="text-white font-medium"
                      >
                        {item.name}
                      </Label>
                      <div className="text-sm text-gray-300 mt-1">
                        <p className="text-teal-400">{item.info}</p>
                        {item.requiresDeposit && (
                          <p className="text-orange-400 text-xs">
                            Security deposit required
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rental Details */}
          <Card className="bg-slate-900/80 border-teal-500/30">
            <CardHeader>
              <CardTitle className="text-white">Rental Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupDate" className="text-white">
                    Pickup Date
                  </Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pickupDate: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="pickupTime" className="text-white">
                    Pickup Time
                  </Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    value={formData.pickupTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pickupTime: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="returnDate" className="text-white">
                    Return Date
                  </Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        returnDate: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="returnTime" className="text-white">
                    Return Time
                  </Label>
                  <Input
                    id="returnTime"
                    type="time"
                    value={formData.returnTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        returnTime: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes" className="text-white">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Any special requirements or questions..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Requirements */}
          <Card className="bg-slate-900/80 border-teal-500/30">
            <CardHeader>
              <CardTitle className="text-white">
                Security Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="idUpload" className="text-white">
                  Upload Valid ID *
                </Label>
                <Input
                  id="idUpload"
                  type="file"
                  accept="image/*,.pdf"
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="addressUpload" className="text-white">
                  Upload Proof of Address *
                </Label>
                <Input
                  id="addressUpload"
                  type="file"
                  accept="image/*,.pdf"
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Rental Information */}
          {hasSelectedEquipment && (
            <Card className="bg-slate-900/80 border-teal-500/30">
              <CardHeader>
                <CardTitle className="text-white">Rental Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-white">
                  <div>
                    <p className="text-teal-400 font-semibold mb-2">
                      🎥 Equipment Rental Details
                    </p>
                    <p className="text-gray-300 mb-4">
                      Our rental rates vary based on equipment type, rental
                      duration, and current availability. We'll provide you with
                      a detailed quote after reviewing your request.
                    </p>
                  </div>

                  <div>
                    <p className="text-teal-400 font-semibold mb-2">
                      📋 What Happens Next
                    </p>
                    <ul className="text-gray-300 space-y-2">
                      <li>
                        • We'll review your documents and equipment selection
                      </li>
                      <li>
                        • Our team will contact you with pricing and
                        availability
                      </li>
                      <li>• Security deposits apply to premium equipment</li>
                      <li>
                        • Pickup and return arrangements will be confirmed
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Terms & Submit */}
          <Card className="bg-slate-900/80 border-teal-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-white">
                  I agree to the rental terms and conditions
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 text-lg"
              >
                Submit Rental Request
              </Button>
            </CardContent>
          </Card>
        </form>

        <RentalConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmRental}
          rentalData={formData}
          equipment={equipment}
        />
      </div>
    </div>
  );
};

export default RentalForm;
