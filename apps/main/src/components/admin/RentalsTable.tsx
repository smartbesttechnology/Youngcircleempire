
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Rental {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  equipment: string[];
  pickupDate: string;
  returnDate: string;
  status: 'pending' | 'confirmed' | 'picked-up' | 'returned' | 'overdue';
  depositAmount: number;
  rentalCost: number;
  contactMethod: string;
}

const RentalsTable = () => {
  const [rentals] = useState<Rental[]>([
    {
      id: "1",
      clientName: "Alex Brown",
      email: "alex@example.com",
      phone: "+234 804 567 8901",
      equipment: ["Sony Alpha A1", "Professional Gimbal"],
      pickupDate: "2024-12-22",
      returnDate: "2024-12-24",
      status: "picked-up",
      depositAmount: 700000,
      rentalCost: 140000,
      contactMethod: "whatsapp"
    },
    {
      id: "2",
      clientName: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+234 805 678 9012",
      equipment: ["LED Light Kit", "External Monitor"],
      pickupDate: "2024-12-25",
      returnDate: "2024-12-27",
      status: "confirmed",
      depositAmount: 350000,
      rentalCost: 90000,
      contactMethod: "call"
    },
    {
      id: "3",
      clientName: "David Lee",
      email: "david@example.com",
      phone: "+234 806 789 0123",
      equipment: ["Wireless Mic Set"],
      pickupDate: "2024-12-18",
      returnDate: "2024-12-20",
      status: "returned",
      depositAmount: 100000,
      rentalCost: 30000,
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
      case 'picked-up': return 'bg-orange-500';
      case 'returned': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const updateStatus = (rentalId: string, newStatus: string) => {
    // In real app, this would update in Supabase
    console.log(`Updating rental ${rentalId} to status: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Equipment Rentals</h2>
      
      <Card className="bg-slate-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3">Client</th>
                  <th className="text-left p-3">Equipment</th>
                  <th className="text-left p-3">Rental Period</th>
                  <th className="text-left p-3">Contact</th>
                  <th className="text-left p-3">Costs</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map(rental => (
                  <tr key={rental.id} className="border-b border-gray-800">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{rental.clientName}</div>
                        <div className="text-sm text-gray-400">{rental.email}</div>
                        <div className="text-sm text-gray-400">{rental.phone}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {rental.equipment.map((item, index) => (
                          <div key={index} className="text-sm bg-gray-800 px-2 py-1 rounded">
                            {item}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>Pickup: {rental.pickupDate}</div>
                      <div>Return: {rental.returnDate}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-teal-400 border-teal-400">
                        {rental.contactMethod}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="text-teal-400">{formatPrice(rental.rentalCost)}</div>
                      <div className="text-orange-400 text-sm">Deposit: {formatPrice(rental.depositAmount)}</div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(rental.status)}>
                        {rental.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Select
                        value={rental.status}
                        onValueChange={(value) => updateStatus(rental.id, value)}
                      >
                        <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="picked-up">Picked Up</SelectItem>
                          <SelectItem value="returned">Returned</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
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

export default RentalsTable;
