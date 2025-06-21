
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Booking {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  services: string[];
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total: number;
  contactMethod: string;
}

const BookingsTable = () => {
  const [bookings] = useState<Booking[]>([
    {
      id: "1",
      clientName: "John Doe",
      email: "john@example.com",
      phone: "+234 801 234 5678",
      services: ["Music Video", "Behind-the-Scenes Video"],
      date: "2024-12-25",
      time: "14:00",
      status: "pending",
      total: 200000,
      contactMethod: "whatsapp"
    },
    {
      id: "2",
      clientName: "Jane Smith",
      email: "jane@example.com",
      phone: "+234 802 345 6789",
      services: ["Empire Platinum Package"],
      date: "2024-12-26",
      time: "10:00",
      status: "confirmed",
      total: 300000,
      contactMethod: "call"
    },
    {
      id: "3",
      clientName: "Mike Johnson",
      email: "mike@example.com",
      phone: "+234 803 456 7890",
      services: ["Music Recording", "Extra Lighting"],
      date: "2024-12-20",
      time: "16:00",
      status: "completed",
      total: 75000,
      contactMethod: "email"
    }
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const updateStatus = (bookingId: string, newStatus: string) => {
    // In real app, this would update in Supabase
    console.log(`Updating booking ${bookingId} to status: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Studio Bookings</h2>
      
      <Card className="bg-slate-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3">Client</th>
                  <th className="text-left p-3">Services</th>
                  <th className="text-left p-3">Date & Time</th>
                  <th className="text-left p-3">Contact</th>
                  <th className="text-left p-3">Total</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id} className="border-b border-gray-800">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{booking.clientName}</div>
                        <div className="text-sm text-gray-400">{booking.email}</div>
                        <div className="text-sm text-gray-400">{booking.phone}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {booking.services.map((service, index) => (
                          <div key={index} className="text-sm bg-gray-800 px-2 py-1 rounded">
                            {service}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>{booking.date}</div>
                      <div className="text-sm text-gray-400">{booking.time}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-teal-400 border-teal-400">
                        {booking.contactMethod}
                      </Badge>
                    </td>
                    <td className="p-3 text-amber-400">
                      {formatPrice(booking.total)}
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Select
                        value={booking.status}
                        onValueChange={(value) => updateStatus(booking.id, value)}
                      >
                        <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsTable;
