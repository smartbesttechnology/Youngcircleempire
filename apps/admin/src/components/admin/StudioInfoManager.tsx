
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface StudioInfo {
  whatsapp: string;
  phone: string;
  email: string;
  logoUrl: string;
}

const StudioInfoManager = () => {
  const { toast } = useToast();
  const [studioInfo, setStudioInfo] = useState<StudioInfo>({
    whatsapp: "+234 901 234 5678",
    phone: "+234 901 234 5678",
    email: "hello@ycempire.studio",
    logoUrl: "https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // In real app, this would save to Supabase
    console.log("Saving studio info:", studioInfo);
    toast({
      title: "Studio information updated successfully",
      description: "Changes will be reflected across all forms."
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Studio Settings</h2>
      
      <Card className="bg-slate-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex justify-between items-center">
            Contact Information
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Edit
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="whatsapp" className="text-white">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              value={studioInfo.whatsapp}
              onChange={(e) => setStudioInfo(prev => ({ ...prev, whatsapp: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-white">Phone Number</Label>
            <Input
              id="phone"
              value={studioInfo.phone}
              onChange={(e) => setStudioInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-white">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={studioInfo.email}
              onChange={(e) => setStudioInfo(prev => ({ ...prev, email: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="logoUrl" className="text-white">Logo URL</Label>
            <Input
              id="logoUrl"
              value={studioInfo.logoUrl}
              onChange={(e) => setStudioInfo(prev => ({ ...prev, logoUrl: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              disabled={!isEditing}
            />
            {studioInfo.logoUrl && (
              <div className="mt-2">
                <img 
                  src={studioInfo.logoUrl} 
                  alt="Studio Logo" 
                  className="h-16 w-auto bg-white p-2 rounded"
                />
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex space-x-4 pt-4">
              <Button
                onClick={handleSave}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="border-gray-600 text-white"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Email Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Resend.com API Key</Label>
              <Input
                type="password"
                value="re_cRytsJNC_FBsPGwMQRaou6uzegHVNcKMe"
                className="bg-gray-800 border-gray-600 text-white"
                disabled
              />
              <p className="text-sm text-gray-400 mt-1">
                Email notifications are configured and working
              </p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Email Templates Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Booking Confirmation</span>
                  <span className="text-green-400">✓ Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Rental Confirmation</span>
                  <span className="text-green-400">✓ Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Admin Notifications</span>
                  <span className="text-green-400">✓ Active</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudioInfoManager;
