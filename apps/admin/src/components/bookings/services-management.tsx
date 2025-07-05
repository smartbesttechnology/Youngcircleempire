import { useState } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { 
  useServices, 
  useBookingCategories,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useCreateBookingCategory,
  useUpdateBookingCategory,
  useDeleteBookingCategory
} from '../../hooks/use-services'

interface ServicesManagementProps {
  open: boolean
  onClose: () => void
}

export function ServicesManagement({ open, onClose }: ServicesManagementProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'categories'>('services')
  const [editingService, setEditingService] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    enabled: true
  })
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    enabled: true
  })

  const { data: services } = useServices()
  const { data: categories } = useBookingCategories()
  const createService = useCreateService()
  const updateService = useUpdateService()
  const deleteService = useDeleteService()
  const createCategory = useCreateBookingCategory()
  const updateCategory = useUpdateBookingCategory()
  const deleteCategory = useDeleteBookingCategory()

  const handleCreateService = () => {
    if (!newService.name) return

    createService.mutate({
      name: newService.name,
      description: newService.description || null,
      category_id: newService.category_id || null,
      price: newService.price ? parseFloat(newService.price) : null,
      enabled: newService.enabled,
      display_order: services?.length || 0
    })

    setNewService({
      name: '',
      description: '',
      category_id: '',
      price: '',
      enabled: true
    })
  }

  const handleCreateCategory = () => {
    if (!newCategory.name) return

    createCategory.mutate({
      name: newCategory.name,
      description: newCategory.description || null,
      enabled: newCategory.enabled,
      display_order: categories?.length || 0
    })

    setNewCategory({
      name: '',
      description: '',
      enabled: true
    })
  }

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      deleteService.mutate(id)
    }
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory.mutate(id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Services & Categories Management</DialogTitle>
          <DialogDescription>
            Manage your booking services and categories
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === 'services' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('services')}
            className="flex-1"
          >
            Services
          </Button>
          <Button
            variant={activeTab === 'categories' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('categories')}
            className="flex-1"
          >
            Categories
          </Button>
        </div>

        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Add New Service */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Service name"
                    value={newService.name}
                    onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Description"
                    value={newService.description}
                    onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Select
                    value={newService.category_id}
                    onValueChange={(value) => setNewService(prev => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No category</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Price (optional)"
                    value={newService.price}
                    onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
                <div className="mt-4">
                  <Button onClick={handleCreateService} disabled={!newService.name}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Services List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Existing Services</CardTitle>
                <CardDescription>
                  {services?.length || 0} services configured
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services?.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            {service.description && (
                              <div className="text-sm text-muted-foreground">
                                {service.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {service.booking_categories?.name || 'No category'}
                        </TableCell>
                        <TableCell>
                          {service.price ? `$${service.price}` : 'Free'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={service.enabled ? 'success' : 'secondary'}>
                            {service.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingService(service.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Add New Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="mt-4">
                  <Button onClick={handleCreateCategory} disabled={!newCategory.name}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Existing Categories</CardTitle>
                <CardDescription>
                  {categories?.length || 0} categories configured
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories?.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || 'No description'}</TableCell>
                        <TableCell>
                          <Badge variant={category.enabled ? 'success' : 'secondary'}>
                            {category.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingCategory(category.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
