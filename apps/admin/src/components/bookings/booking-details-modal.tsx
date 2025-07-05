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

interface BookingDetailsModalProps {
  bookingId: string
  open: boolean
  onClose: () => void
}

export function BookingDetailsModal({ bookingId, open, onClose }: BookingDetailsModalProps) {
  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!bookingId && open,
  })

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">Loading booking details...</div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!booking) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">Booking not found</div>
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
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Complete information for booking #{booking.id.slice(-8)}
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
                  <p className="text-sm">{booking.first_name} {booking.last_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{booking.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm">{booking.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preferred Contact</label>
                  <p className="text-sm">{booking.contact_method}</p>
                </div>
              </div>

              {(booking.instagram_handle || booking.tiktok_handle) && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Social Media</label>
                  <div className="flex space-x-4 mt-1">
                    {booking.instagram_handle && (
                      <span className="text-sm">Instagram: @{booking.instagram_handle}</span>
                    )}
                    {booking.tiktok_handle && (
                      <span className="text-sm">TikTok: @{booking.tiktok_handle}</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="text-sm">{format(new Date(booking.booking_date), 'EEEE, MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Time</label>
                  <p className="text-sm">{booking.booking_time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="text-sm">{booking.duration || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">People</label>
                  <p className="text-sm">{booking.people || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  {getStatusBadge(booking.status || 'pending')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {booking.services.map((service, index) => (
                  <Badge key={index} variant="outline" className="mr-2">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add-ons */}
          {booking.addons && booking.addons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add-ons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {booking.addons.map((addon, index) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {addon}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {booking.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{booking.notes}</p>
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
                    {booking.created_at && format(new Date(booking.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">
                    {booking.updated_at && format(new Date(booking.updated_at), 'MMM dd, yyyy HH:mm')}
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
