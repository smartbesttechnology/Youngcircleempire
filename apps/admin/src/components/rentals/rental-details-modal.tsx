import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

interface RentalDetailsModalProps {
  rentalId: number
  open: boolean
  onClose: () => void
}

export function RentalDetailsModal({ rentalId, open, onClose }: RentalDetailsModalProps) {
  const { data: rental, isLoading } = useQuery({
    queryKey: ['rental', rentalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_rentals')
        .select('*')
        .eq('id', rentalId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!rentalId && open,
  })

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">Loading rental details...</div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!rental) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">Rental not found</div>
        </DialogContent>
      </Dialog>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      case 'picked_up':
        return <Badge variant="default">Picked Up</Badge>
      case 'returned':
        return <Badge variant="secondary">Returned</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rental Details</DialogTitle>
          <DialogDescription>
            Complete information for rental #{rental.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm">{rental.first_name} {rental.last_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{rental.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm">{rental.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preferred Contact</label>
                  <p className="text-sm">{rental.contact_method}</p>
                </div>
              </div>

              {(rental.instagram_handle || rental.tiktok_handle) && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Social Media</label>
                  <div className="flex space-x-4 mt-1">
                    {rental.instagram_handle && (
                      <span className="text-sm">Instagram: @{rental.instagram_handle}</span>
                    )}
                    {rental.tiktok_handle && (
                      <span className="text-sm">TikTok: @{rental.tiktok_handle}</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rental Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rental Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pickup Date</label>
                  <p className="text-sm">{format(new Date(rental.pickup_date), 'EEEE, MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pickup Time</label>
                  <p className="text-sm">{rental.pickup_time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Return Date</label>
                  <p className="text-sm">{format(new Date(rental.return_date), 'EEEE, MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Return Time</label>
                  <p className="text-sm">{rental.return_time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="text-sm">{rental.duration || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(rental.status || 'pending')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Equipment Requested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rental.equipment.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                    <Badge variant="outline">{item}</Badge>
                    {rental.quantity && typeof rental.quantity === 'object' && (rental.quantity as any)[item] && (
                      <span className="text-sm text-muted-foreground">
                        Qty: {(rental.quantity as any)[item]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {rental.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{rental.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timestamps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">
                    {rental.created_at && format(new Date(rental.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">
                    {rental.updated_at && format(new Date(rental.updated_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
