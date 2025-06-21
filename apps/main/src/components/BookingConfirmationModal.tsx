
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface Service {
  id: string;
  name: string;
  price: number;
}

interface Addon {
  id: string;
  name: string;
  price: number;
}

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingData: BookingData;
  services: Service[];
  addons: Addon[];
  total: number;
}

const BookingConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  bookingData,
  services,
  addons,
  total
}: BookingConfirmationModalProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const selectedServices = services.filter(service => bookingData.services.includes(service.id));
  const selectedAddons = addons.filter(addon => bookingData.addons.includes(addon.id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-amber-500 text-white max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-amber-400 text-xl">Confirm Your Booking</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Client Information */}
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">Client Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">Name:</span> {bookingData.fullName}</p>
                <p><span className="text-gray-400">Phone:</span> {bookingData.phone}</p>
                <p><span className="text-gray-400">Email:</span> {bookingData.email}</p>
                <p><span className="text-gray-400">Preferred Contact:</span> {bookingData.contactMethod}</p>
              </div>
            </div>

            {/* Selected Services */}
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">Selected Services</h3>
              <div className="space-y-2">
                {selectedServices.map(service => (
                  <div key={service.id} className="flex justify-between items-center text-sm">
                    <span>{service.name}</span>
                    <span className="text-amber-400">{formatPrice(service.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Add-ons */}
            {selectedAddons.length > 0 && (
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">Add-ons</h3>
                <div className="space-y-2">
                  {selectedAddons.map(addon => (
                    <div key={addon.id} className="flex justify-between items-center text-sm">
                      <span>{addon.name}</span>
                      <span className="text-amber-400">{formatPrice(addon.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Details */}
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">Booking Details</h3>
              <div className="space-y-1 text-sm">
                {bookingData.date && <p><span className="text-gray-400">Date:</span> {bookingData.date}</p>}
                {bookingData.time && <p><span className="text-gray-400">Time:</span> {bookingData.time}</p>}
                {bookingData.duration && <p><span className="text-gray-400">Duration:</span> {bookingData.duration}</p>}
                {bookingData.people && <p><span className="text-gray-400">Number of People:</span> {bookingData.people}</p>}
                {bookingData.notes && <p><span className="text-gray-400">Notes:</span> {bookingData.notes}</p>}
              </div>
            </div>

            {/* Payment Information */}
            {total > 0 && (
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">Payment</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-400">Total:</span> <span className="text-amber-400 font-bold">{formatPrice(total)}</span></p>
                  {bookingData.paymentMethod && (
                    <p><span className="text-gray-400">Payment Method:</span> {bookingData.paymentMethod === 'pay-now' ? 'Pay Now (Online)' : 'Pay at Studio'}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={onClose} 
            variant="outline"
            className="flex-1 border-gray-600 text-white hover:bg-gray-800"
          >
            Edit Details
          </Button>
          <Button 
            onClick={onConfirm}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-black font-bold"
          >
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationModal;
