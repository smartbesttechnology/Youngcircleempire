import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Tables, TablesInsert, TablesUpdate } from '../lib/types'
import { toast } from 'sonner'
import { useEffect } from 'react'

type Service = Tables<'services'>
type ServiceInsert = TablesInsert<'services'>
type ServiceUpdate = TablesUpdate<'services'>

type BookingCategory = Tables<'booking_categories'>
type BookingCategoryInsert = TablesInsert<'booking_categories'>
type BookingCategoryUpdate = TablesUpdate<'booking_categories'>

export function useServices() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          booking_categories (
            id,
            name
          )
        `)
        .order('display_order', { ascending: true })

      if (error) throw error
      return data as (Service & { booking_categories: { id: string; name: string } | null })[]
    },
  })

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['services'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return query
}

export function useBookingCategories() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['booking-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      return data as BookingCategory[]
    },
  })

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('booking-categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'booking_categories',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['booking-categories'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return query
}

export function useCreateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (service: ServiceInsert) => {
      const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service created successfully')
    },
    onError: (error) => {
      console.error('Error creating service:', error)
      toast.error('Failed to create service')
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ServiceUpdate }) => {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service updated successfully')
    },
    onError: (error) => {
      console.error('Error updating service:', error)
      toast.error('Failed to update service')
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting service:', error)
      toast.error('Failed to delete service')
    },
  })
}

export function useCreateBookingCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (category: BookingCategoryInsert) => {
      const { data, error } = await supabase
        .from('booking_categories')
        .insert(category)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-categories'] })
      toast.success('Category created successfully')
    },
    onError: (error) => {
      console.error('Error creating category:', error)
      toast.error('Failed to create category')
    },
  })
}

export function useUpdateBookingCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: BookingCategoryUpdate }) => {
      const { data, error } = await supabase
        .from('booking_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-categories'] })
      toast.success('Category updated successfully')
    },
    onError: (error) => {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    },
  })
}

export function useDeleteBookingCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('booking_categories')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-categories'] })
      toast.success('Category deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    },
  })
}
