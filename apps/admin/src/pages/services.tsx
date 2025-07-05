import { useState, useEffect } from 'react'
import {
  Settings,
  Plus,
  Search,
  Eye,
  Trash2,
  Edit,
  GripVertical,
  ToggleLeft,
  ToggleRight,
  Package,
  Clock,
  DollarSign,
  CheckCircle
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { supabase } from '../lib/supabase'

interface BookingCategory {
  id: string
  name: string
  description: string
  enabled: boolean
  display_order: number
  created_at: string
  updated_at: string
  services?: BookingService[]
}

interface BookingService {
  id: string
  category_id: string
  name: string
  description: string
  duration: number
  price: number
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Sortable Category Component
function SortableCategory({ category, onEdit, onDelete, onToggleStatus, services }: {
  category: BookingCategory
  onEdit: (category: BookingCategory) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, enabled: boolean) => void
  services: BookingService[]
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div {...attributes} {...listeners} className="cursor-move">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleStatus(category.id, !category.enabled)}
              className="flex items-center space-x-1 text-sm"
            >
              {category.enabled ? (
                <ToggleRight className="h-5 w-5 text-green-600" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-gray-400" />
              )}
              <span className={category.enabled ? 'text-green-600' : 'text-gray-400'}>
                {category.enabled ? 'Active' : 'Inactive'}
              </span>
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(category.id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Services in this category:</span>
            <span className="font-medium">{services.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {services.slice(0, 3).map((service) => (
              <span
                key={service.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {service.name}
              </span>
            ))}
            {services.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                +{services.length - 3} more
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Sortable Service Component
function SortableService({ service, category, onEdit, onDelete, onToggleStatus }: {
  service: BookingService
  category?: BookingCategory
  onEdit: (service: BookingService) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, isActive: boolean) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div {...attributes} {...listeners} className="cursor-move">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <CardTitle className="text-base">{service.name}</CardTitle>
              <CardDescription className="text-sm">
                {category?.name || 'Unknown Category'}
              </CardDescription>
            </div>
          </div>
          <button
            onClick={() => onToggleStatus(service.id, !service.is_active)}
            className="flex items-center"
          >
            {service.is_active ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {service.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{service.duration || 0}min</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span>${service.price || 0}</span>
            </div>
          </div>
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(service)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(service.id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ServicesPage() {
  const [categories, setCategories] = useState<BookingCategory[]>([])
  const [services, setServices] = useState<BookingService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<BookingCategory | null>(null)
  const [selectedService, setSelectedService] = useState<BookingService | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{type: 'category' | 'service', id: string} | null>(null)
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    enabled: true
  })
  const [serviceForm, setServiceForm] = useState({
    category_id: '',
    name: '',
    description: '',
    duration: 60,
    price: 0,
    is_active: true
  })
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'categories' | 'services'>('categories')

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('booking_categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (categoriesError) {
        throw categoriesError
      }

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('booking_services')
        .select('*')
        .order('order_index', { ascending: true })

      if (servicesError) {
        throw servicesError
      }

      setCategories(categoriesData || [])
      setServices(servicesData || [])
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(`Failed to load data: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategoryStatus = async (categoryId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('booking_categories')
        .update({ enabled, updated_at: new Date().toISOString() })
        .eq('id', categoryId)

      if (error) throw error

      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? { ...cat, enabled } : cat
      ))
    } catch (err: any) {
      console.error('Error updating category status:', err)
      alert(`Failed to update status: ${err.message}`)
    }
  }

  const toggleServiceStatus = async (serviceId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('booking_services')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', serviceId)

      if (error) throw error

      setServices(prev => prev.map(service => 
        service.id === serviceId ? { ...service, is_active: isActive } : service
      ))
    } catch (err: any) {
      console.error('Error updating service status:', err)
      alert(`Failed to update status: ${err.message}`)
    }
  }

  const handleCreateCategory = async () => {
    try {
      const maxOrder = Math.max(...categories.map(c => c.display_order), 0)
      
      const { data, error } = await supabase
        .from('booking_categories')
        .insert([{
          ...categoryForm,
          display_order: maxOrder + 1
        }])
        .select()
        .single()

      if (error) throw error

      setCategories(prev => [...prev, data])
      setShowCategoryModal(false)
      setCategoryForm({ name: '', description: '', enabled: true })
    } catch (err: any) {
      console.error('Error creating category:', err)
      alert(`Failed to create category: ${err.message}`)
    }
  }

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return

    try {
      const { data, error } = await supabase
        .from('booking_categories')
        .update({
          ...categoryForm,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCategory.id)
        .select()
        .single()

      if (error) throw error

      setCategories(prev => prev.map(cat => 
        cat.id === selectedCategory.id ? data : cat
      ))
      setShowCategoryModal(false)
      setSelectedCategory(null)
      setCategoryForm({ name: '', description: '', enabled: true })
    } catch (err: any) {
      console.error('Error updating category:', err)
      alert(`Failed to update category: ${err.message}`)
    }
  }

  const handleCreateService = async () => {
    try {
      const categoryServices = services.filter(s => s.category_id === serviceForm.category_id)
      const maxOrder = Math.max(...categoryServices.map(s => s.order_index), 0)
      
      const { data, error } = await supabase
        .from('booking_services')
        .insert([{
          ...serviceForm,
          order_index: maxOrder + 1
        }])
        .select()
        .single()

      if (error) throw error

      setServices(prev => [...prev, data])
      setShowServiceModal(false)
      setServiceForm({
        category_id: '',
        name: '',
        description: '',
        duration: 60,
        price: 0,
        is_active: true
      })
    } catch (err: any) {
      console.error('Error creating service:', err)
      alert(`Failed to create service: ${err.message}`)
    }
  }

  const handleUpdateService = async () => {
    if (!selectedService) return

    try {
      const { data, error } = await supabase
        .from('booking_services')
        .update({
          ...serviceForm,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedService.id)
        .select()
        .single()

      if (error) throw error

      setServices(prev => prev.map(service => 
        service.id === selectedService.id ? data : service
      ))
      setShowServiceModal(false)
      setSelectedService(null)
      setServiceForm({
        category_id: '',
        name: '',
        description: '',
        duration: 60,
        price: 0,
        is_active: true
      })
    } catch (err: any) {
      console.error('Error updating service:', err)
      alert(`Failed to update service: ${err.message}`)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      if (deleteTarget.type === 'category') {
        const { error } = await supabase
          .from('booking_categories')
          .delete()
          .eq('id', deleteTarget.id)

        if (error) throw error

        setCategories(prev => prev.filter(cat => cat.id !== deleteTarget.id))
        setServices(prev => prev.filter(service => service.category_id !== deleteTarget.id))
      } else {
        const { error } = await supabase
          .from('booking_services')
          .delete()
          .eq('id', deleteTarget.id)

        if (error) throw error

        setServices(prev => prev.filter(service => service.id !== deleteTarget.id))
      }

      setShowDeleteDialog(false)
      setDeleteTarget(null)
    } catch (err: any) {
      console.error('Error deleting:', err)
      alert(`Failed to delete: ${err.message}`)
    }
  }

  const openEditCategory = (category: BookingCategory) => {
    setSelectedCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      enabled: category.enabled
    })
    setShowCategoryModal(true)
  }

  const openEditService = (service: BookingService) => {
    setSelectedService(service)
    setServiceForm({
      category_id: service.category_id,
      name: service.name,
      description: service.description || '',
      duration: service.duration || 60,
      price: service.price || 0,
      is_active: service.is_active
    })
    setShowServiceModal(true)
  }

  const openDeleteDialog = (type: 'category' | 'service', id: string) => {
    setDeleteTarget({ type, id })
    setShowDeleteDialog(true)
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getServicesForCategory = (categoryId: string) => {
    return services.filter(service => service.category_id === categoryId)
  }

  const handleCategoryDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = categories.findIndex((item) => item.id === active.id)
      const newIndex = categories.findIndex((item) => item.id === over?.id)

      const newCategories = arrayMove(categories, oldIndex, newIndex)
      setCategories(newCategories)

      // Update display_order in database
      try {
        const updates = newCategories.map((category, index) => ({
          id: category.id,
          display_order: index + 1
        }))

        for (const update of updates) {
          await supabase
            .from('booking_categories')
            .update({ display_order: update.display_order, updated_at: new Date().toISOString() })
            .eq('id', update.id)
        }
      } catch (err: any) {
        console.error('Error updating category order:', err)
        // Revert on error
        fetchData()
      }
    }
  }

  const handleServiceDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = filteredServices.findIndex((item) => item.id === active.id)
      const newIndex = filteredServices.findIndex((item) => item.id === over?.id)

      const newServices = arrayMove(filteredServices, oldIndex, newIndex)

      // Update the main services array
      const updatedServices = services.map(service => {
        const newService = newServices.find(ns => ns.id === service.id)
        return newService || service
      })
      setServices(updatedServices)

      // Update order_index in database
      try {
        const updates = newServices.map((service, index) => ({
          id: service.id,
          order_index: index + 1
        }))

        for (const update of updates) {
          await supabase
            .from('booking_services')
            .update({ order_index: update.order_index, updated_at: new Date().toISOString() })
            .eq('id', update.id)
        }
      } catch (err: any) {
        console.error('Error updating service order:', err)
        // Revert on error
        fetchData()
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services & Categories</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services & Categories</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Error loading data</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={fetchData}>Try Again</Button>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services & Categories</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage booking categories and services ({categories.length} categories, {services.length} services)
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setCategoryForm({ name: '', description: '', enabled: true })
              setSelectedCategory(null)
              setShowCategoryModal(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setServiceForm({
                category_id: categories[0]?.id || '',
                name: '',
                description: '',
                duration: 60,
                price: 0,
                is_active: true
              })
              setSelectedService(null)
              setShowServiceModal(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Service
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {categories.filter(c => c.enabled).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              {services.filter(s => s.is_active).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.length > 0 ? Math.round(services.reduce((sum, s) => sum + (s.duration || 0), 0) / services.length) : 0}m
            </div>
            <p className="text-xs text-muted-foreground">
              Average service time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${services.length > 0 ? Math.round(services.reduce((sum, s) => sum + (s.price || 0), 0) / services.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Average service price
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'categories' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('categories')}
        >
          Categories ({categories.length})
        </Button>
        <Button
          variant={activeTab === 'services' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('services')}
        >
          Services ({services.length})
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleCategoryDragEnd}
        >
          <SortableContext
            items={filteredCategories.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <SortableCategory
                  key={category.id}
                  category={category}
                  onEdit={openEditCategory}
                  onDelete={(id) => openDeleteDialog('category', id)}
                  onToggleStatus={toggleCategoryStatus}
                  services={getServicesForCategory(category.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleServiceDragEnd}
        >
          <SortableContext
            items={filteredServices.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const category = categories.find(c => c.id === service.category_id)
                return (
                  <SortableService
                    key={service.id}
                    service={service}
                    category={category}
                    onEdit={openEditService}
                    onDelete={(id) => openDeleteDialog('service', id)}
                    onToggleStatus={toggleServiceStatus}
                  />
                )
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Category Modal */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory ? 'Update category information' : 'Add a new booking category'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category Name</label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Audio Services"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this category"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="categoryEnabled"
                checked={categoryForm.enabled}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, enabled: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="categoryEnabled" className="text-sm font-medium">
                Enable this category
              </label>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCategoryModal(false)
                  setSelectedCategory(null)
                  setCategoryForm({ name: '', description: '', enabled: true })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={selectedCategory ? handleUpdateCategory : handleCreateCategory}
                disabled={!categoryForm.name.trim()}
              >
                {selectedCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Modal */}
      <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedService ? 'Edit Service' : 'Create New Service'}
            </DialogTitle>
            <DialogDescription>
              {selectedService ? 'Update service information' : 'Add a new booking service'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select
                value={serviceForm.category_id}
                onChange={(e) => setServiceForm(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.filter(c => c.enabled).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Service Name</label>
              <input
                type="text"
                value={serviceForm.name}
                onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Studio Session"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                value={serviceForm.description}
                onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this service"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                <input
                  type="number"
                  value={serviceForm.duration}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Price ($)</label>
                <input
                  type="number"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="serviceActive"
                checked={serviceForm.is_active}
                onChange={(e) => setServiceForm(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="serviceActive" className="text-sm font-medium">
                Enable this service
              </label>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowServiceModal(false)
                  setSelectedService(null)
                  setServiceForm({
                    category_id: '',
                    name: '',
                    description: '',
                    duration: 60,
                    price: 0,
                    is_active: true
                  })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={selectedService ? handleUpdateService : handleCreateService}
                disabled={!serviceForm.name.trim() || !serviceForm.category_id}
              >
                {selectedService ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {deleteTarget?.type}?
              {deleteTarget?.type === 'category' && ' This will also delete all services in this category.'}
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
