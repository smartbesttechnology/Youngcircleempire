import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Tables, TablesInsert, TablesUpdate } from '../lib/types'
import { toast } from 'sonner'
import { useEffect } from 'react'
// import { logger } from '../components/debug-panel'

type EquipmentRental = Tables<'equipment_rentals'>
type EquipmentItem = Tables<'equipment_items'>
type EquipmentCategory = Tables<'equipment_categories'>
type EquipmentItemInsert = TablesInsert<'equipment_items'>
type EquipmentItemUpdate = TablesUpdate<'equipment_items'>
type EquipmentCategoryInsert = TablesInsert<'equipment_categories'>
type EquipmentCategoryUpdate = TablesUpdate<'equipment_categories'>

export function useEquipmentRentals(filters?: {
  status?: string
  dateFrom?: string
  dateTo?: string
}) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['equipment-rentals', filters],
    queryFn: async () => {
      try {
        console.log('Fetching equipment rentals with filters', filters)

        let query = supabase
          .from('equipment_rentals')
          .select('*')
          .order('created_at', { ascending: false })

        if (filters?.status && filters.status !== 'all') {
          query = query.eq('status', filters.status)
        }

        if (filters?.dateFrom) {
          query = query.gte('pickup_date', filters.dateFrom)
        }

        if (filters?.dateTo) {
          query = query.lte('pickup_date', filters.dateTo)
        }

        const { data, error } = await query

        if (error) {
          console.error('Error fetching equipment rentals', { error: error.message, details: error })
          throw error
        }

        console.log('Successfully fetched equipment rentals', { count: data?.length || 0, data })
        return data as EquipmentRental[]
      } catch (error) {
        console.error('Exception in equipment rentals query', { error })
        throw error
      }
    },
    onError: (error) => {
      console.error('React Query error in useEquipmentRentals', { error })
    },
    onSuccess: (data) => {
      console.log('useEquipmentRentals query successful', { count: data?.length || 0 })
    }
  })

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('equipment-rentals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment_rentals',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['equipment-rentals'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return query
}

export function useEquipmentItems() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['equipment-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_items')
        .select(`
          *,
          equipment_categories (
            id,
            name
          )
        `)
        .order('name', { ascending: true })

      if (error) throw error
      return data as (EquipmentItem & { equipment_categories: { id: string; name: string } | null })[]
    },
  })

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('equipment-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment_items',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['equipment-items'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return query
}

export function useEquipmentCategories() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['equipment-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      return data as EquipmentCategory[]
    },
  })

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('equipment-categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment_categories',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['equipment-categories'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return query
}

export function useCreateEquipmentItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (item: EquipmentItemInsert) => {
      const { data, error } = await supabase
        .from('equipment_items')
        .insert(item)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-items'] })
      toast.success('Equipment item created successfully')
    },
    onError: (error) => {
      console.error('Error creating equipment item:', error)
      toast.error('Failed to create equipment item')
    },
  })
}

export function useUpdateEquipmentItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: EquipmentItemUpdate }) => {
      const { data, error } = await supabase
        .from('equipment_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-items'] })
      toast.success('Equipment item updated successfully')
    },
    onError: (error) => {
      console.error('Error updating equipment item:', error)
      toast.error('Failed to update equipment item')
    },
  })
}

export function useDeleteEquipmentItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('equipment_items')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-items'] })
      toast.success('Equipment item deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting equipment item:', error)
      toast.error('Failed to delete equipment item')
    },
  })
}

export function useCreateEquipmentCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (category: EquipmentCategoryInsert) => {
      const { data, error } = await supabase
        .from('equipment_categories')
        .insert(category)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-categories'] })
      toast.success('Equipment category created successfully')
    },
    onError: (error) => {
      console.error('Error creating equipment category:', error)
      toast.error('Failed to create equipment category')
    },
  })
}

export function useUpdateEquipmentCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: EquipmentCategoryUpdate }) => {
      const { data, error } = await supabase
        .from('equipment_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-categories'] })
      toast.success('Equipment category updated successfully')
    },
    onError: (error) => {
      console.error('Error updating equipment category:', error)
      toast.error('Failed to update equipment category')
    },
  })
}

export function useDeleteEquipmentCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('equipment_categories')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-categories'] })
      toast.success('Equipment category deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting equipment category:', error)
      toast.error('Failed to delete equipment category')
    },
  })
}

export function useUpdateRentalStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data, error } = await supabase
        .from('equipment_rentals')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-rentals'] })
      toast.success('Rental status updated successfully')
    },
    onError: (error) => {
      console.error('Error updating rental status:', error)
      toast.error('Failed to update rental status')
    },
  })
}

export function useRentalStats() {
  return useQuery({
    queryKey: ['rental-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_rentals')
        .select('status, created_at')

      if (error) throw error

      const total = data.length
      const pending = data.filter(r => r.status === 'pending').length
      const confirmed = data.filter(r => r.status === 'confirmed').length
      const active = data.filter(r => r.status === 'picked_up').length

      // Calculate this month vs last month
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

      const thisMonthRentals = data.filter(r => 
        new Date(r.created_at!) >= thisMonth
      ).length

      const lastMonthRentals = data.filter(r => {
        const createdAt = new Date(r.created_at!)
        return createdAt >= lastMonth && createdAt < thisMonth
      }).length

      const growth = lastMonthRentals === 0 ? 0 : 
        ((thisMonthRentals - lastMonthRentals) / lastMonthRentals) * 100

      return {
        total,
        pending,
        confirmed,
        active,
        thisMonth: thisMonthRentals,
        lastMonth: lastMonthRentals,
        growth: Math.round(growth)
      }
    },
  })
}
