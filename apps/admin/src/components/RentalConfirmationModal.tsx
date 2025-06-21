
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface Equipment {
  id: string;
  name: string;
  depositRequired: boolean;
  depositAmount: number;
  dailyRate: number;
}

interface RentalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  rentalData: RentalData;
  equipment: Equipment[];
  totalRental: number;
  totalDeposit: number;
}

const RentalConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  rentalData,
  equipment,
  totalRental,
  totalDeposit
}: RentalConfirmationModalProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const selectedEquipment = equipment.filter(item => rentalData.equipment.includes(item.id));

  const calculateDuration = () => {
    if (!rentalData.pickupDate || !rentalData.returnDate) return "Not specified";
    
    const pickup = new Date(rentalData.pickupDate);
    const returnDate = new Date(rentalData.returnDate);
    const days = Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-teal-500 text-white max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-teal-400 text-xl">Confirm Your Rental</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Client Information */}
            <div>
              <h3 className="text-teal-400 font-semibold mb-2">Client Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">Name:</span> {rentalData.fullName}</p>
                <p><span className="text-gray-400">Phone:</span> {rentalData.phone}</p>
                <p><span className="text-gray-400">Email:</span> {rentalData.email}</p>
                <p><span className="text-gray-400">Preferred Contact:</span> {rentalData.contactMethod}</p>
              </div>
            </div>

            {/* Selected Equipment */}
            <div>
              <h3 className="text-teal-400 font-semibold mb-2">Selected Equipment</h3>
              <div className="space-y-2">
                {selectedEquipment.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span>{item.name}</span>
                    <div className="text-right">
                      <div className="text-teal-400">{formatPrice(item.dailyRate)}/day</div>
                      {item.depositRequired && (
                        <div className="text-orange-400 text-xs">Deposit: {formatPrice(item.depositAmount)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Details */}
            <div>
              <h3 className="text-teal-400 font-semibold mb-2">Rental Details</h3>
              <div className="space-y-1 text-sm">
                {rentalData.pickupDate && (
                  <p><span className="text-gray-400">Pickup:</span> {rentalData.pickupDate} {rentalData.pickupTime && `at ${rentalData.pickupTime}`}</p>
                )}
                {rentalData.returnDate && (
                  <p><span className="text-gray-400">Return:</span> {rentalData.returnDate} {rentalData.returnTime && `at ${rentalData.returnTime}`}</p>
                )}
                <p><span className="text-gray-400">Duration:</span> {calculateDuration()}</p>
                {rentalData.notes && <p><span className="text-gray-400">Notes:</span> {rentalData.notes}</p>}
              </div>
            </div>

            {/* Pricing */}
            {(totalRental > 0 || totalDeposit > 0) && (
              <div>
                <h3 className="text-teal-400 font-semibold mb-2">Pricing</h3>
                <div className="space-y-1 text-sm">
                  {totalRental > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rental Cost:</span>
                      <span className="text-teal-400">{formatPrice(totalRental)}</span>
                    </div>
                  )}
                  {totalDeposit > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Security Deposit:</span>
                      <span className="text-orange-400">{formatPrice(totalDeposit)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-600 pt-2 flex justify-between font-bold">
                    <span>Total Due:</span>
                    <span className="text-teal-400">{formatPrice(totalRental + totalDeposit)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    * Deposit is refundable upon safe return
                  </p>
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
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold"
          >
            Confirm Rental
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentalConfirmationModal;
