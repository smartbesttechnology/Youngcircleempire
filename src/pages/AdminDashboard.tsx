
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ServicesManager from "@/components/admin/ServicesManager";
import EquipmentManager from "@/components/admin/EquipmentManager";
import BookingsTable from "@/components/admin/BookingsTable";
import RentalsTable from "@/components/admin/RentalsTable";
import StudioInfoManager from "@/components/admin/StudioInfoManager";
import AppSettingsManager from "@/components/admin/AppSettingsManager";
import PaymentSettingsManager from "@/components/admin/PaymentSettingsManager";
import BundleManager from "@/components/admin/BundleManager";
import InvoiceManager from "@/components/admin/InvoiceManager";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock auth state

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Logged out successfully"
    });
    navigate('/admin/login');
  };

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <img 
              src="https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png" 
              alt="Young Circle Empire" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Young Circle Empire Management</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              View Site
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 bg-slate-800">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="services" className="text-white">Services</TabsTrigger>
            <TabsTrigger value="equipment" className="text-white">Equipment</TabsTrigger>
            <TabsTrigger value="bundles" className="text-white">Bundles</TabsTrigger>
            <TabsTrigger value="bookings" className="text-white">Bookings</TabsTrigger>
            <TabsTrigger value="rentals" className="text-white">Rentals</TabsTrigger>
            <TabsTrigger value="invoices" className="text-white">Invoices</TabsTrigger>
            <TabsTrigger value="payments" className="text-white">Payments</TabsTrigger>
            <TabsTrigger value="settings" className="text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-900 border-teal-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm font-medium">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-400">24</div>
                  <p className="text-xs text-gray-400">+4 from last week</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900 border-teal-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm font-medium">Active Rentals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-400">8</div>
                  <p className="text-xs text-gray-400">+2 from last week</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-amber-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm font-medium">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">₦2.4M</div>
                  <p className="text-xs text-gray-400">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-green-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm font-medium">Equipment Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">85%</div>
                  <p className="text-xs text-gray-400">+8% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                        <div>
                          <p className="text-white font-medium">Client {i}</p>
                          <p className="text-gray-400 text-sm">Music Video Session</p>
                        </div>
                        <div className="text-teal-400 text-sm">
                          Dec {20 + i}, 2024
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Equipment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Sony Alpha A1</span>
                      <span className="text-green-400">Available</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Professional Gimbal</span>
                      <span className="text-orange-400">Rented</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">LED Light Kit</span>
                      <span className="text-green-400">Available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentManager />
          </TabsContent>

          <TabsContent value="bundles">
            <BundleManager />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsTable />
          </TabsContent>

          <TabsContent value="rentals">
            <RentalsTable />
          </TabsContent>

          <TabsContent value="invoices">
            <InvoiceManager />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentSettingsManager />
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <AppSettingsManager />
              <StudioInfoManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
