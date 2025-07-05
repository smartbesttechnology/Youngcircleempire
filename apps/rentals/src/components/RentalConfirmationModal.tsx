import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  tagline: string;
  description: string;
  dailyRate: string;
  deposit: string;
}

interface RentalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  rentalData: RentalData;
  equipment: Equipment[];
  isSubmitting?: boolean;
}

const RentalConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  rentalData,
  equipment,
  isSubmitting = false,
}: RentalConfirmationModalProps) => {
  const selectedEquipment = equipment.filter((eq) =>
    rentalData.equipment.includes(eq.id),
  );

  const calculateRentalDuration = () => {
    if (rentalData.pickupDate && rentalData.returnDate) {
      const pickup = new Date(rentalData.pickupDate);
      const returnDate = new Date(rentalData.returnDate);
      const diffTime = Math.abs(returnDate.getTime() - pickup.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 1;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-teal-500 text-white max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-teal-400 text-xl">
            Confirm Your Equipment Rental
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-teal-400 font-semibold mb-2">
                Customer Information
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-400">Name:</span>{" "}
                  {rentalData.firstName} {rentalData.lastName}
                </p>
                <p>
                  <span className="text-gray-400">Phone:</span>{" "}
                  {rentalData.phone}
                </p>
                <p>
                  <span className="text-gray-400">Email:</span>{" "}
                  {rentalData.email}
                </p>
                <p>
                  <span className="text-gray-400">Preferred Contact:</span>{" "}
                  {rentalData.contactMethod}
                </p>
                {rentalData.instagramHandle && (
                  <p>
                    <span className="text-gray-400">Instagram:</span>{" "}
                    {rentalData.instagramHandle}
                  </p>
                )}
                {rentalData.tiktokHandle && (
                  <p>
                    <span className="text-gray-400">TikTok:</span>{" "}
                    {rentalData.tiktokHandle}
                  </p>
                )}
              </div>
            </div>

            {/* Selected Equipment */}
            <div>
              <h3 className="text-teal-400 font-semibold mb-2">
                Selected Equipment
              </h3>
              <div className="space-y-3">
                {selectedEquipment.map((eq) => (
                  <div
                    key={eq.id}
                    className="bg-gray-800/50 border border-gray-600 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-medium">{eq.name}</h4>
                        <p className="text-teal-400 text-sm">{eq.tagline}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-green-400 text-sm">
                            {eq.dailyRate}/day
                          </span>
                          <span className="text-gray-400 text-sm">
                            Qty: {rentalData.quantity[eq.id] || 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Details */}
            <div>
              <h3 className="text-teal-400 font-semibold mb-2">
                Rental Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Pickup:</p>
                    <p className="text-white">
                      {formatDate(rentalData.pickupDate)}
                    </p>
                    <p className="text-white">
                      {formatTime(rentalData.pickupTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Return:</p>
                    <p className="text-white">
                      {formatDate(rentalData.returnDate)}
                    </p>
                    <p className="text-white">
                      {formatTime(rentalData.returnTime)}
                    </p>
                  </div>
                </div>
                <div className="bg-teal-900/20 border border-teal-500/30 rounded-lg p-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Duration:</span>
                    <span className="text-teal-400 font-bold">
                      {calculateRentalDuration()} day(s)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {rentalData.notes && (
              <div>
                <h3 className="text-teal-400 font-semibold mb-2">
                  Additional Notes
                </h3>
                <p className="text-gray-300 text-sm bg-gray-800/50 border border-gray-600 rounded-lg p-3">
                  {rentalData.notes}
                </p>
              </div>
            )}

            {/* Important Information */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-2">
                Important Information
              </h3>
              <ul className="text-yellow-200 text-sm space-y-1">
                <li>• Security deposits are required for all equipment</li>
                <li>• Equipment must be returned in original condition</li>
                <li>• Late returns may incur additional charges</li>
                <li>• Damage or loss will be deducted from deposit</li>
                <li>• Pickup and return times are strictly enforced</li>
              </ul>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-600">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            disabled={isSubmitting}
          >
            Back to Edit
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm Rental"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentalConfirmationModal;
