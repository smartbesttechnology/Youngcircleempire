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
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import RentalConfirmationModal from "@/components/RentalConfirmationModal";
import EquipmentCategorySelection from "@/components/EquipmentCategorySelection";
import { supabase } from "@/integrations/supabase/client";
import { sendRentalConfirmationEmail } from "@/lib/email";

interface RentalData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactMethod: string;
  equipment: string[];
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  duration: string;
  quantity: { [key: string]: number };
  notes: string;
  instagramHandle: string;
  tiktokHandle: string;
}

interface Equipment {
  id: string;
  name: string;
  categoryId: string;
  category: string;
  tagline: string;
  description: string;
  dailyRate: string;
  deposit: string;
  availability: string;
}

interface EquipmentCategory {
  id: string;
  name: string;
}

const RentalsForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Temporary test function for debugging email integration
  const testEmailIntegration = async () => {
    try {
      console.log("🧪 Testing rental email integration...");
      
      const testData = {
        customerName: "Test User",
        customerEmail: "test@example.com", // Change this to your email
        equipment: ["Professional Camera"],
        pickupDate: "2025-01-20",
        pickupTime: "10:00",
        returnDate: "2025-01-22",
        returnTime: "18:00",
        notes: "Test rental for email integration debugging"
      };
      
      const success = await sendRentalConfirmationEmail(testData);
      
      if (success) {
        alert("✅ Rental email test successful! Check your inbox and Vercel logs.");
      } else {
        alert("❌ Rental email test failed. Check browser console and Vercel logs for details.");
      }
    } catch (error) {
      console.error("💥 Rental email test error:", error);
      alert("💥 Rental email test error: " + error.message);
    }
  };

  const [currentStep, setCurrentStep] = useState<"category" | "equipment">(
    "category",
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedEquipment, setExpandedEquipment] = useState<Set<string>>(
    new Set(),
  );
  const [formData, setFormData] = useState<RentalData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    contactMethod: "",
    equipment: [],
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    duration: "",
    quantity: {},
    notes: "",
    instagramHandle: "",
    tiktokHandle: "",
  });

  // Equipment data organized by categories
  const equipment: Equipment[] = [
    // Audio Equipment
    {
      id: "shure-sm7b",
      name: "Shure SM7B Microphone",
      categoryId: "audio-equipment",
      category: "Audio Equipment",
      tagline: "Professional broadcast microphone",
      description: "Industry-standard dynamic microphone perfect for vocals, podcasts, and broadcasting.",
      dailyRate: "₦15,000",
      deposit: "₦50,000",
      availability: "Available"
    },
    {
      id: "audio-technica-ath-m50x",
      name: "Audio-Technica ATH-M50x",
      categoryId: "audio-equipment", 
      category: "Audio Equipment",
      tagline: "Professional studio headphones",
      description: "Critical listening headphones with exceptional clarity and deep, accurate bass response.",
      dailyRate: "₦8,000",
      deposit: "₦25,000",
      availability: "Available"
    },
    {
      id: "yamaha-hs8",
      name: "Yamaha HS8 Studio Monitors",
      categoryId: "audio-equipment",
      category: "Audio Equipment", 
      tagline: "Professional studio monitors",
      description: "Bi-amplified nearfield studio monitors for accurate sound reproduction.",
      dailyRate: "₦20,000",
      deposit: "₦80,000",
      availability: "Available"
    },
    // Recording Equipment
    {
      id: "focusrite-scarlett-2i2",
      name: "Focusrite Scarlett 2i2",
      categoryId: "recording-equipment",
      category: "Recording Equipment",
      tagline: "USB audio interface",
      description: "2-input, 2-output USB audio interface with high-quality preamps.",
      dailyRate: "₦12,000",
      deposit: "₦40,000", 
      availability: "Available"
    },
    {
      id: "dbx-286s",
      name: "DBX 286s Microphone Preamp",
      categoryId: "recording-equipment",
      category: "Recording Equipment",
      tagline: "Microphone preamp processor",
      description: "Complete microphone preamp with compressor, de-esser, enhancer, and expander/gate.",
      dailyRate: "₦18,000",
      deposit: "₦60,000",
      availability: "Available"
    },
    {
      id: "ssl-2-bus-compressor",
      name: "SSL 2+ Bus Compressor",
      categoryId: "recording-equipment",
      category: "Recording Equipment",
      tagline: "Analog bus compressor",
      description: "Classic SSL bus compressor for professional mix bus processing.",
      dailyRate: "₦25,000",
      deposit: "₦100,000",
      availability: "Limited"
    },
    // Instruments
    {
      id: "yamaha-p45",
      name: "Yamaha P-45 Digital Piano",
      categoryId: "instruments",
      category: "Instruments",
      tagline: "88-key weighted digital piano",
      description: "Full-size 88-key digital piano with weighted action and realistic piano sound.",
      dailyRate: "₦20,000",
      deposit: "₦80,000",
      availability: "Available"
    },
    {
      id: "fender-stratocaster",
      name: "Fender Player Stratocaster",
      categoryId: "instruments",
      category: "Instruments", 
      tagline: "Electric guitar",
      description: "Classic Stratocaster electric guitar with versatile pickup configuration.",
      dailyRate: "₦15,000",
      deposit: "₦120,000",
      availability: "Available"
    },
    {
      id: "pearl-export-drums",
      name: "Pearl Export Drum Kit",
      categoryId: "instruments",
      category: "Instruments",
      tagline: "5-piece acoustic drum kit",
      description: "Complete 5-piece drum kit with cymbals and hardware.",
      dailyRate: "₦35,000",
      deposit: "₦200,000",
      availability: "Available"
    },
    // Video Equipment
    {
      id: "sony-fx3",
      name: "Sony FX3 Cinema Camera",
      categoryId: "video-equipment",
      category: "Video Equipment",
      tagline: "Full-frame cinema camera",
      description: "Professional cinema camera with 4K recording and advanced autofocus.",
      dailyRate: "₦80,000",
      deposit: "₦500,000",
      availability: "Available"
    },
    {
      id: "aputure-120d",
      name: "Aputure 120D LED Light",
      categoryId: "video-equipment",
      category: "Video Equipment",
      tagline: "Professional LED lighting",
      description: "Daylight-balanced LED light with wireless control and high CRI.",
      dailyRate: "₦25,000",
      deposit: "₦100,000",
      availability: "Available"
    },
    {
      id: "manfrotto-tripod",
      name: "Manfrotto Carbon Fiber Tripod",
      categoryId: "video-equipment",
      category: "Video Equipment",
      tagline: "Professional camera tripod",
      description: "Lightweight carbon fiber tripod with fluid head for smooth camera movements.",
      dailyRate: "₦15,000",
      deposit: "₦80,000",
      availability: "Available"
    }
  ];

  const categories: EquipmentCategory[] = [
    { id: "audio-equipment", name: "Audio Equipment" },
    { id: "recording-equipment", name: "Recording Equipment" },
    { id: "instruments", name: "Instruments" },
    { id: "video-equipment", name: "Video Equipment" }
  ];

  const handleCategoryNext = () => {
    if (selectedCategoryId) {
      setCurrentStep("equipment");
    }
  };

  const toggleEquipmentExpansion = (equipmentId: string) => {
    setExpandedEquipment((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(equipmentId)) {
        newSet.delete(equipmentId);
      } else {
        newSet.add(equipmentId);
      }
      return newSet;
    });
  };

  const handleEquipmentChange = (equipmentId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      equipment: checked
        ? [...prev.equipment, equipmentId]
        : prev.equipment.filter((id) => id !== equipmentId),
    }));

    // Initialize quantity to 1 when equipment is selected
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        quantity: { ...prev.quantity, [equipmentId]: 1 },
      }));
    } else {
      // Remove quantity when equipment is deselected
      setFormData((prev) => {
        const newQuantity = { ...prev.quantity };
        delete newQuantity[equipmentId];
        return { ...prev, quantity: newQuantity };
      });
    }
  };

  const handleQuantityChange = (equipmentId: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity: { ...prev.quantity, [equipmentId]: Math.max(1, quantity) },
    }));
  };

  const calculateRentalDuration = () => {
    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);
      const diffTime = Math.abs(returnDate.getTime() - pickup.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 1;
  };

  const filteredEquipment = selectedCategoryId
    ? equipment.filter((eq) => eq.categoryId === selectedCategoryId)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.email ||
      !formData.pickupDate ||
      !formData.pickupTime ||
      !formData.returnDate ||
      !formData.returnTime ||
      formData.equipment.length === 0
    ) {
      toast({
        title: "Please fill in all required fields",
        description: "Name, email, phone, pickup/return dates and times, and at least one equipment item are required.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate dates
    const pickupDate = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pickupDate < today) {
      toast({
        title: "Invalid pickup date",
        description: "Pickup date cannot be in the past.",
        variant: "destructive",
      });
      return;
    }

    if (returnDate <= pickupDate) {
      toast({
        title: "Invalid return date",
        description: "Return date must be after pickup date.",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmRental = async () => {
    setIsSubmitting(true);
    try {
      console.log("Rental confirmed:", formData);

      // Step 1: Save rental data to Supabase
      const rentalData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        contact_method: formData.contactMethod || "WhatsApp",
        equipment: formData.equipment,
        pickup_date: formData.pickupDate,
        pickup_time: formData.pickupTime,
        return_date: formData.returnDate,
        return_time: formData.returnTime,
        duration: calculateRentalDuration().toString(),
        quantity: formData.quantity,
        notes: formData.notes || null,
        instagram_handle: formData.instagramHandle || null,
        tiktok_handle: formData.tiktokHandle || null
      };

      const { data, error } = await supabase
        .from("equipment_rentals")
        .insert([rentalData])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        toast({
          title: "Database Error",
          description: "Failed to save rental data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Rental saved to database:", data);

      // Step 2: Send confirmation email
      const selectedEquipmentNames = equipment
        .filter(eq => formData.equipment.includes(eq.id))
        .map(eq => eq.name);

      const emailData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        equipment: selectedEquipmentNames,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        returnDate: formData.returnDate,
        returnTime: formData.returnTime,
        notes: formData.notes
      };

      const emailSent = await sendRentalConfirmationEmail(emailData);

      if (emailSent) {
        console.log("Confirmation email sent successfully");
      } else {
        console.log("Email sending failed, but rental was saved");
      }

      // Step 3: Navigate to thank you page
      toast({
        title: "Rental Request Submitted!",
        description: "We'll contact you shortly to confirm availability and arrange pickup.",
      });

      // Navigate to thank you page after a short delay
      setTimeout(() => {
        navigate("/thank-you");
      }, 2000);

    } catch (error) {
      console.error("Error submitting rental:", error);
      toast({
        title: "Submission Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 overflow-x-hidden">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src="https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png"
            alt="Young Circle Empire"
            className="mx-auto mb-6 h-20 w-auto"
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            Empire Equipment Rentals
          </h1>
          <p className="text-teal-400 max-w-3xl mx-auto text-lg">
            Professional equipment rentals for creators and artists. Quality gear when you need it.
          </p>
        </div>

        {/* Category Selection Step */}
        {currentStep === "category" && (
          <EquipmentCategorySelection
            selectedCategory={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
            onNext={handleCategoryNext}
          />
        )}

        {/* Equipment Selection and Booking Step */}
        {currentStep === "equipment" && (
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-0"
          >
            {/* Back Button */}
            <Button
              onClick={() => setCurrentStep("category")}
              variant="ghost"
              className="text-teal-400 hover:text-teal-300 hover:bg-teal-900/20 border-0 px-0 font-normal transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>

            {/* Equipment Selection */}
            <Card className="bg-black/80 border-teal-500/30">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {/* Category Title with Icon */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl sm:text-2xl flex-shrink-0">
                    {selectedCategoryId === "audio-equipment" && "🎧"}
                    {selectedCategoryId === "recording-equipment" && "🎛️"}
                    {selectedCategoryId === "instruments" && "🎸"}
                    {selectedCategoryId === "video-equipment" && "📹"}
                  </div>
                  <h1 className="text-teal-600 text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">
                    {categories.find(cat => cat.id === selectedCategoryId)?.name}
                  </h1>
                </div>
                <p className="text-teal-400 text-sm sm:text-base mb-6">
                  Select the equipment you need for your project
                </p>

                {/* Equipment List */}
                <div className="space-y-4">
                  {filteredEquipment.map((eq) => (
                    <div
                      key={eq.id}
                      className="border border-gray-600 rounded-lg p-4 hover:border-teal-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            id={eq.id}
                            checked={formData.equipment.includes(eq.id)}
                            onCheckedChange={(checked) =>
                              handleEquipmentChange(eq.id, checked as boolean)
                            }
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-white font-semibold text-sm sm:text-base">
                                  {eq.name}
                                </h3>
                                <p className="text-teal-400 text-xs sm:text-sm">
                                  {eq.tagline}
                                </p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-green-400 text-xs sm:text-sm font-medium">
                                    {eq.dailyRate}/day
                                  </span>
                                  <span className="text-gray-400 text-xs">
                                    Deposit: {eq.deposit}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    eq.availability === "Available" 
                                      ? "bg-green-900/30 text-green-400" 
                                      : "bg-yellow-900/30 text-yellow-400"
                                  }`}>
                                    {eq.availability}
                                  </span>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleEquipmentExpansion(eq.id)}
                                className="text-gray-400 hover:text-white p-1"
                              >
                                {expandedEquipment.has(eq.id) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </div>

                            {/* Quantity selector for selected equipment */}
                            {formData.equipment.includes(eq.id) && (
                              <div className="mt-3 flex items-center gap-2">
                                <Label className="text-white text-sm">Quantity:</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={formData.quantity[eq.id] || 1}
                                  onChange={(e) =>
                                    handleQuantityChange(eq.id, parseInt(e.target.value) || 1)
                                  }
                                  className="w-20 bg-gray-800 border-gray-600 text-white"
                                />
                              </div>
                            )}

                            {/* Expanded description */}
                            {expandedEquipment.has(eq.id) && (
                              <div className="mt-3 pt-3 border-t border-gray-600">
                                <p className="text-gray-300 text-sm leading-relaxed">
                                  {eq.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="bg-black/80 border-teal-500/30">
              <CardHeader>
                <CardTitle className="text-white">Customer Information</CardTitle>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-white">
                      Phone Number *
                    </Label>
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
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
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
                </div>

                <div>
                  <Label className="text-white">Preferred Contact Method</Label>
                  <RadioGroup
                    value={formData.contactMethod}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, contactMethod: value }))
                    }
                    className="flex flex-wrap gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="WhatsApp" id="whatsapp" />
                      <Label htmlFor="whatsapp" className="text-white">
                        WhatsApp
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Phone Call" id="phone-call" />
                      <Label htmlFor="phone-call" className="text-white">
                        Phone Call
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Email" id="email-contact" />
                      <Label htmlFor="email-contact" className="text-white">
                        Email
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Social Media Handles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram" className="text-white">
                      Instagram Handle
                    </Label>
                    <Input
                      id="instagram"
                      placeholder="@yourusername"
                      value={formData.instagramHandle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          instagramHandle: e.target.value,
                        }))
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tiktok" className="text-white">
                      TikTok Handle
                    </Label>
                    <Input
                      id="tiktok"
                      placeholder="@yourusername"
                      value={formData.tiktokHandle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tiktokHandle: e.target.value,
                        }))
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rental Details */}
            <Card className="bg-black/80 border-teal-500/30">
              <CardHeader>
                <CardTitle className="text-white">Rental Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickupDate" className="text-white">
                      Pickup Date *
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
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickupTime" className="text-white">
                      Pickup Time *
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
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="returnDate" className="text-white">
                      Return Date *
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
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="returnTime" className="text-white">
                      Return Time *
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
                      required
                    />
                  </div>
                </div>

                {/* Rental Duration Display */}
                {formData.pickupDate && formData.returnDate && (
                  <div className="bg-teal-900/20 border border-teal-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Rental Duration:</span>
                      <span className="text-teal-400 font-bold">
                        {calculateRentalDuration()} day(s)
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="notes" className="text-white">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements or notes about your rental..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="bg-black/80 border-teal-500/30">
              <CardHeader>
                <CardTitle className="text-white">Terms and Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-gray-300 max-h-64 overflow-y-auto">
                  <div>
                    <h4 className="text-teal-400 font-semibold">
                      1. Equipment Rental Agreement
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                      <li>
                        All equipment rentals require a valid government-issued ID and security deposit.
                      </li>
                      <li>
                        Equipment must be returned in the same condition as received.
                      </li>
                      <li>
                        Renter is responsible for any damage, loss, or theft during rental period.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-teal-400 font-semibold">
                      2. Pickup and Return
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                      <li>
                        Equipment must be picked up and returned at scheduled times.
                      </li>
                      <li>
                        Late returns will incur additional daily rental charges.
                      </li>
                      <li>
                        Equipment not returned within 7 days will be considered stolen.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-teal-400 font-semibold">
                      3. Security Deposits
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                      <li>
                        Security deposits are required for all equipment rentals.
                      </li>
                      <li>
                        Deposits will be refunded upon satisfactory return of equipment.
                      </li>
                      <li>
                        Damage or cleaning fees will be deducted from deposits.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-teal-400 font-semibold">
                      4. Equipment Condition
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                      <li>
                        All equipment is inspected before and after rental.
                      </li>
                      <li>
                        Report any issues immediately upon pickup.
                      </li>
                      <li>
                        Normal wear and tear is acceptable; damage is not.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-teal-400 font-semibold">
                      5. Cancellation Policy
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                      <li>
                        Cancellations must be made at least 24 hours in advance.
                      </li>
                      <li>
                        Late cancellations may incur a 50% charge.
                      </li>
                      <li>
                        No-shows will be charged the full rental amount.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-teal-400 font-semibold">
                      6. Liability
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                      <li>
                        Renter assumes full responsibility for equipment during rental period.
                      </li>
                      <li>
                        Young Circle Empire is not liable for any injuries or damages.
                      </li>
                      <li>
                        Renter agrees to use equipment safely and as intended.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-6 mt-6">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-white">
                    I accept the Terms and Conditions
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
        )}

        {/* Debug Test Button - Remove in production */}
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={testEmailIntegration}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg"
          >
            🧪 Test Email
          </Button>
        </div>

        <RentalConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmRental}
          rentalData={formData}
          equipment={equipment}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default RentalsForm;
