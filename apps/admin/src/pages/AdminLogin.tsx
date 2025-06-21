
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in real app, use Supabase auth
    if (credentials.email === "admin@ycempire.studio" && credentials.password === "admin123") {
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard."
      });
      navigate('/admin');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-amber-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png" 
            alt="Young Circle Empire" 
            className="mx-auto mb-4 h-20 w-auto"
          />
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
        </div>

        <Card className="bg-black/80 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-white text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold"
              >
                Sign In
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                Demo credentials: admin@ycempire.studio / admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
