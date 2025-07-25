import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookingData {
  firstName: string;
  lastName: string;
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
  instagramHandle: string;
  tiktokHandle: string;
}

interface Service {
  id: string;
  name: string;
  tagline: string;
  description: string;
}

interface Addon {
  id: string;
  name: string;
}

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingData: BookingData;
  services: Service[];
  addons: Addon[];
  isSubmitting?: boolean;
}

const BookingConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  bookingData,
  services,
  addons,
  isSubmitting = false,
}: BookingConfirmationModalProps) => {
  const selectedServices = services.filter((service) =>
    bookingData.services.includes(service.id),
  );

  const selectedAddons = addons.filter((addon) =>
    bookingData.addons.includes(addon.id),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-amber-500 text-white max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-amber-400 text-xl">
            Confirm Your Booking
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Client Information */}
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">
                Client Information
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-400">Name:</span>{" "}
                  {bookingData.firstName} {bookingData.lastName}
                </p>
                <p>
                  <span className="text-gray-400">Phone:</span>{" "}
                  {bookingData.phone}
                </p>
                <p>
                  <span className="text-gray-400">Email:</span>{" "}
                  {bookingData.email}
                </p>
                <p>
                  <span className="text-gray-400">Preferred Contact:</span>{" "}
                  {bookingData.contactMethod}
                </p>
                {bookingData.instagramHandle && (
                  <p>
                    <span className="text-gray-400">Instagram:</span>{" "}
                    {bookingData.instagramHandle}
                  </p>
                )}
                {bookingData.tiktokHandle && (
                  <p>
                    <span className="text-gray-400">TikTok:</span>{" "}
                    {bookingData.tiktokHandle}
                  </p>
                )}
              </div>
            </div>

            {/* Selected Services */}
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">
                Selected Services
              </h3>
              <div className="space-y-2">
                {selectedServices.map((service) => (
                  <div key={service.id} className="text-sm">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-amber-400 text-xs">
                      {service.tagline}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Add-ons */}
            {selectedAddons.length > 0 && (
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">
                  Selected Add-ons
                </h3>
                <div className="space-y-1">
                  {selectedAddons.map((addon) => (
                    <div key={addon.id} className="text-sm">
                      <div className="text-white">• {addon.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Details */}
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">
                Booking Details
              </h3>
              <div className="space-y-1 text-sm">
                {bookingData.date && (
                  <p>
                    <span className="text-gray-400">Date:</span>{" "}
                    {bookingData.date}
                  </p>
                )}
                {bookingData.time && (
                  <p>
                    <span className="text-gray-400">Time:</span>{" "}
                    {bookingData.time}
                  </p>
                )}
                {bookingData.duration && (
                  <p>
                    <span className="text-gray-400">Duration:</span>{" "}
                    {bookingData.duration}
                  </p>
                )}
                {bookingData.people && (
                  <p>
                    <span className="text-gray-400">Number of People:</span>{" "}
                    {bookingData.people}
                  </p>
                )}
                {bookingData.notes && (
                  <p>
                    <span className="text-gray-400">Notes:</span>{" "}
                    {bookingData.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Next Steps Information */}
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">Next Steps</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  ✨ Our team will review your request and contact you within 24
                  hours with:
                </p>
                <ul className="text-gray-300 ml-4 space-y-1">
                  <li>• Detailed pricing for your selected services</li>
                  <li>• Available time slots for your preferred date</li>
                  <li>• Payment options and booking confirmation</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex pt-4">
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationModal;
