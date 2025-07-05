import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Tables, TablesUpdate } from '../lib/types'
import { toast } from 'sonner'
import { useEffect } from 'react'

type User = Tables<'users'>
type Link = Tables<'links'>
type UserUpdate = TablesUpdate<'users'>
type LinkUpdate = TablesUpdate<'links'>

export function useUsers() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          links (
            id,
            title,
            url,
            visible
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as (User & { links: Link[] })[]
    },
  })

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['users'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return query
}

export function useUserDetails(userId: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          links (
            id,
            title,
            url,
            icon,
            visible,
            display_order,
            created_at,
            updated_at
          )
        `)
        .eq('id', userId)
        .single()

      if (error) throw error
      return data as User & { links: Link[] }
    },
    enabled: !!userId,
  })

  // Real-time subscription for links
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`user-${userId}-links-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'links',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['user', userId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient, userId])

  return query
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UserUpdate }) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', data.id] })
      toast.success('User updated successfully')
    },
    onError: (error) => {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // First delete all links for this user
      await supabase
        .from('links')
        .delete()
        .eq('user_id', id)

      // Then delete the user
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    },
  })
}

export function useUpdateLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: LinkUpdate }) => {
      const { data, error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', data.user_id] })
      toast.success('Link updated successfully')
    },
    onError: (error) => {
      console.error('Error updating link:', error)
      toast.error('Failed to update link')
    },
  })
}

export function useDeleteLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Link deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting link:', error)
      toast.error('Failed to delete link')
    },
  })
}

export function useLinksStats() {
  return useQuery({
    queryKey: ['links-stats'],
    queryFn: async () => {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, created_at')

      if (usersError) throw usersError

      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('id, created_at, visible')

      if (linksError) throw linksError

      const totalUsers = users.length
      const totalLinks = links.length
      const activeLinks = links.filter(l => l.visible).length

      // Calculate this month vs last month
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

      const thisMonthUsers = users.filter(u => 
        new Date(u.created_at!) >= thisMonth
      ).length

      const lastMonthUsers = users.filter(u => {
        const createdAt = new Date(u.created_at!)
        return createdAt >= lastMonth && createdAt < thisMonth
      }).length

      const growth = lastMonthUsers === 0 ? 0 : 
        ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100

      return {
        totalUsers,
        totalLinks,
        activeLinks,
        thisMonth: thisMonthUsers,
        lastMonth: lastMonthUsers,
        growth: Math.round(growth)
      }
    },
  })
}

export function useToggleLinkVisibility() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, visible }: { id: string; visible: boolean }) => {
      const { data, error } = await supabase
        .from('links')
        .update({ visible })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', data.user_id] })
      toast.success(`Link ${data.visible ? 'enabled' : 'disabled'} successfully`)
    },
    onError: (error) => {
      console.error('Error toggling link visibility:', error)
      toast.error('Failed to update link visibility')
    },
  })
}
