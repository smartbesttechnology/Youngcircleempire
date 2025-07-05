import { format } from 'date-fns'
import {
  Calendar,
  Camera,
  Link as LinkIcon,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Package
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { useBookingStats } from '../hooks/use-bookings'
import { useRentalStats } from '../hooks/use-rentals'
import { useLinksStats } from '../hooks/use-links'
import { useBookings } from '../hooks/use-bookings'
import { useEquipmentRentals } from '../hooks/use-rentals'
import { DashboardCharts } from '../components/dashboard/dashboard-charts'

export function DashboardPage() {
  const { data: bookingStats } = useBookingStats()
  const { data: rentalStats } = useRentalStats()
  const { data: linkStats } = useLinksStats()

  // Get recent data for tables
  const { data: recentBookings } = useBookings()
  const { data: recentRentals } = useEquipmentRentals()

  const recentBookingsData = recentBookings?.slice(0, 5) || []
  const recentRentalsData = recentRentals?.slice(0, 5) || []

  const getStatusBadge = (status: string, type: 'booking' | 'rental') => {
    if (type === 'booking') {
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
    } else {
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
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome to the Young Circle Empire admin dashboard
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Today's Schedule
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{bookingStats?.growth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rentalStats?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              {rentalStats?.pending || 0} pending requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Link Profiles</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkStats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {linkStats?.activeLinks || 0} active links
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(bookingStats?.thisMonth || 0) + (rentalStats?.thisMonth || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              New bookings & rentals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <DashboardCharts />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Latest studio bookings and requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookingsData.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No recent bookings
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookingsData.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {booking.first_name} {booking.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking.services.slice(0, 1).join(', ')}
                            {booking.services.length > 1 && ` +${booking.services.length - 1} more`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(booking.booking_date), 'MMM dd')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status || 'pending', 'booking')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Rentals</CardTitle>
            <CardDescription>
              Latest equipment rental requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentRentalsData.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No recent rentals
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Pickup</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRentalsData.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {rental.first_name} {rental.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {rental.equipment.slice(0, 1).join(', ')}
                            {rental.equipment.length > 1 && ` +${rental.equipment.length - 1} more`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(rental.pickup_date), 'MMM dd')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(rental.status || 'pending', 'rental')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">View Today's Bookings</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Package className="h-6 w-6 mb-2" />
              <span className="text-sm">Check Equipment</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              <span className="text-sm">Revenue Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
