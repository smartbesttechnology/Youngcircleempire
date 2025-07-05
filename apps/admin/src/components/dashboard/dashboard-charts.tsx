import { useQuery } from '@tanstack/react-query'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { supabase } from '../../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function DashboardCharts() {
  // Bookings by week
  const { data: bookingTrends } = useQuery({
    queryKey: ['booking-trends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('created_at, status')
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group by week
      const weeklyData: { [key: string]: number } = {}
      data.forEach(booking => {
        const date = new Date(booking.created_at!)
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        const weekKey = weekStart.toISOString().split('T')[0]
        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1
      })

      return Object.entries(weeklyData)
        .slice(-8) // Last 8 weeks
        .map(([week, count]) => ({
          week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          bookings: count
        }))
    },
  })

  // Service popularity
  const { data: serviceStats } = useQuery({
    queryKey: ['service-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('services')

      if (error) throw error

      const serviceCounts: { [key: string]: number } = {}
      data.forEach(booking => {
        booking.services.forEach((service: string) => {
          serviceCounts[service] = (serviceCounts[service] || 0) + 1
        })
      })

      return Object.entries(serviceCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([service, count]) => ({
          service: service.length > 15 ? service.substring(0, 15) + '...' : service,
          count
        }))
    },
  })

  // Equipment rental frequency
  const { data: equipmentStats } = useQuery({
    queryKey: ['equipment-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_rentals')
        .select('equipment')

      if (error) throw error

      const equipmentCounts: { [key: string]: number } = {}
      data.forEach(rental => {
        rental.equipment.forEach((item: string) => {
          equipmentCounts[item] = (equipmentCounts[item] || 0) + 1
        })
      })

      return Object.entries(equipmentCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([equipment, count]) => ({
          equipment: equipment.length > 15 ? equipment.substring(0, 15) + '...' : equipment,
          count
        }))
    },
  })

  // Status distribution
  const { data: statusDistribution } = useQuery({
    queryKey: ['status-distribution'],
    queryFn: async () => {
      const [bookingsResult, rentalsResult] = await Promise.all([
        supabase.from('bookings').select('status'),
        supabase.from('equipment_rentals').select('status')
      ])

      if (bookingsResult.error) throw bookingsResult.error
      if (rentalsResult.error) throw rentalsResult.error

      const allStatuses = [
        ...bookingsResult.data.map(b => b.status || 'pending'),
        ...rentalsResult.data.map(r => r.status || 'pending')
      ]

      const statusCounts: { [key: string]: number } = {}
      allStatuses.forEach(status => {
        statusCounts[status] = (statusCounts[status] || 0) + 1
      })

      return Object.entries(statusCounts).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count
      }))
    },
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Booking Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Trends</CardTitle>
          <CardDescription>
            Weekly booking volume over the last 8 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingTrends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Popular Services */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Services</CardTitle>
          <CardDescription>
            Most booked services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceStats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="service" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Equipment Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Usage</CardTitle>
          <CardDescription>
            Most rented equipment items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={equipmentStats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="equipment" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
          <CardDescription>
            Current status breakdown across all requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {statusDistribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
