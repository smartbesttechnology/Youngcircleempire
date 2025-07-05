import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Camera,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Settings,
  Package,
  Clock,
  DollarSign,
  Edit,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { supabase } from '../lib/supabase'

interface Rental {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  rental_date: string
  rental_time: string
  equipment: string[]
  status: string
  contact_method: string
  created_at: string
}

export function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [rentalToDelete, setRentalToDelete] = useState<string | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFromFilter, setDateFromFilter] = useState('')
  const [dateToFilter, setDateToFilter] = useState('')

  useEffect(() => {
    fetchRentals()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [rentals, searchTerm, statusFilter, dateFromFilter, dateToFilter])

  const fetchRentals = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('equipment_rentals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching rentals:', error)
        setError(`Failed to load rentals: ${error.message}`)
        return
      }

      setRentals(data || [])
    } catch (err: any) {
      console.error('Exception fetching rentals:', err)
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...rentals]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(rental =>
        rental.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.phone.includes(searchTerm)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(rental => rental.status === statusFilter)
    }

    // Date range filter
    if (dateFromFilter) {
      filtered = filtered.filter(rental => rental.rental_date >= dateFromFilter)
    }
    if (dateToFilter) {
      filtered = filtered.filter(rental => rental.rental_date <= dateToFilter)
    }

    setFilteredRentals(filtered)
  }

  const updateRentalStatus = async (rentalId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('equipment_rentals')
        .update({ status: newStatus })
        .eq('id', rentalId)

      if (error) {
        console.error('Error updating rental status:', error)
        alert(`Failed to update status: ${error.message}`)
        return
      }

      // Update local state
      setRentals(prev => prev.map(rental =>
        rental.id === rentalId ? { ...rental, status: newStatus } : rental
      ))

      console.log(`Rental ${rentalId} status updated to ${newStatus}`)
    } catch (err: any) {
      console.error('Exception updating rental status:', err)
      alert(`Error: ${err.message}`)
    }
  }

  const deleteRental = async (rentalId: string) => {
    try {
      const { error } = await supabase
        .from('equipment_rentals')
        .delete()
        .eq('id', rentalId)

      if (error) {
        console.error('Error deleting rental:', error)
        alert(`Failed to delete rental: ${error.message}`)
        return
      }

      // Update local state
      setRentals(prev => prev.filter(rental => rental.id !== rentalId))
      setShowDeleteDialog(false)
      setRentalToDelete(null)

      console.log(`Rental ${rentalId} deleted successfully`)
    } catch (err: any) {
      console.error('Exception deleting rental:', err)
      alert(`Error: ${err.message}`)
    }
  }

  const handleViewDetails = (rental: Rental) => {
    setSelectedRental(rental)
    setShowDetailsModal(true)
  }

  const handleDeleteClick = (rentalId: string) => {
    setRentalToDelete(rentalId)
    setShowDeleteDialog(true)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'picked_up':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'returned':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Equipment Rentals</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading rentals...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Equipment Rentals</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Error loading rentals</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={fetchRentals}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Equipment Rentals</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage equipment rentals ({filteredRentals.length} total)
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Rental
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Manage Equipment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rentals</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rentals.length}</div>
            <p className="text-xs text-muted-foreground">
              All time rentals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rentals.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rentals.filter(r => r.status === 'confirmed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently rented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rentals.filter(r => {
                const rentalDate = new Date(r.rental_date)
                const now = new Date()
                return rentalDate.getMonth() === now.getMonth() &&
                       rentalDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Current month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="picked_up">Picked Up</option>
                <option value="returned">Returned</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">From Date</label>
              <input
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">To Date</label>
              <input
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredRentals.length} of {rentals.length} rentals
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setDateFromFilter('')
                setDateToFilter('')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Professional Rentals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Rentals</CardTitle>
          <CardDescription>
            Showing {filteredRentals.length} of {rentals.length} rentals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {rental.first_name} {rental.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{rental.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{rental.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{rental.rental_date}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{rental.rental_time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {rental.equipment?.join(', ') || 'No equipment'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={rental.status}
                        onChange={(e) => updateRentalStatus(rental.id, e.target.value)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-white dark:bg-gray-700 ${getStatusBadgeColor(rental.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="returned">Returned</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(rental)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(rental.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showDetailsModal && selectedRental && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Rental Details</DialogTitle>
              <DialogDescription>
                View and manage rental information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Customer</label>
                  <p className="text-sm text-gray-600">
                    {selectedRental.first_name} {selectedRental.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-gray-600">{selectedRental.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-sm text-gray-600">{selectedRental.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <p className="text-sm text-gray-600">{selectedRental.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <p className="text-sm text-gray-600">{selectedRental.rental_date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <p className="text-sm text-gray-600">{selectedRental.rental_time}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Equipment</label>
                <p className="text-sm text-gray-600">
                  {selectedRental.equipment?.join(', ') || 'No equipment'}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Rental</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this rental? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => rentalToDelete && deleteRental(rentalToDelete)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
