import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Tables, TablesUpdate } from '../lib/types'
import { toast } from 'sonner'
import { useEffect } from 'react'
// import { logger } from '../components/debug-panel'

type Booking = Tables<'bookings'>
type BookingUpdate = TablesUpdate<'bookings'>

export function useBookings(filters?: {
  status?: string
  dateFrom?: string
  dateTo?: string
  service?: string
}) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['bookings', filters],
    queryFn: async () => {
      try {
        console.log('Fetching bookings with filters', filters)

        let query = supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })

        if (filters?.status && filters.status !== 'all') {
          query = query.eq('status', filters.status)
        }

        if (filters?.dateFrom) {
          query = query.gte('booking_date', filters.dateFrom)
        }

        if (filters?.dateTo) {
          query = query.lte('booking_date', filters.dateTo)
        }

        if (filters?.service) {
          query = query.contains('services', [filters.service])
        }

        const { data, error } = await query

        if (error) {
          console.error('Error fetching bookings', { error: error.message, details: error })
          throw error
        }

        console.log('Successfully fetched bookings', { count: data?.length || 0, data })
        return data as Booking[]
      } catch (error) {
        console.error('Exception in bookings query', { error })
        throw error
      }
    },
    onError: (error) => {
      console.error('React Query error in useBookings', { error })
    },
    onSuccess: (data) => {
      console.log('useBookings query successful', { count: data?.length || 0 })
    }
  })

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['bookings'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return query
}

export function useUpdateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: BookingUpdate }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking updated successfully')
    },
    onError: (error) => {
      console.error('Error updating booking:', error)
      toast.error('Failed to update booking')
    },
  })
}

export function useDeleteBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting booking:', error)
      toast.error('Failed to delete booking')
    },
  })
}

export function useBookingStats() {
  return useQuery({
    queryKey: ['booking-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('status, created_at')

      if (error) throw error

      const total = data.length
      const pending = data.filter(b => b.status === 'pending').length
      const confirmed = data.filter(b => b.status === 'confirmed').length
      const cancelled = data.filter(b => b.status === 'cancelled').length

      // Calculate this month vs last month
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

      const thisMonthBookings = data.filter(b => 
        new Date(b.created_at!) >= thisMonth
      ).length

      const lastMonthBookings = data.filter(b => {
        const createdAt = new Date(b.created_at!)
        return createdAt >= lastMonth && createdAt < thisMonth
      }).length

      const growth = lastMonthBookings === 0 ? 0 : 
        ((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100

      return {
        total,
        pending,
        confirmed,
        cancelled,
        thisMonth: thisMonthBookings,
        lastMonth: lastMonthBookings,
        growth: Math.round(growth)
      }
    },
  })
}
