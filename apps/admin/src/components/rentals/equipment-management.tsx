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
  useEquipmentItems,
  useEquipmentCategories,
  useCreateEquipmentItem,
  useUpdateEquipmentItem,
  useDeleteEquipmentItem,
  useCreateEquipmentCategory,
  useUpdateEquipmentCategory,
  useDeleteEquipmentCategory
} from '../../hooks/use-rentals'

interface EquipmentManagementProps {
  open: boolean
  onClose: () => void
}

export function EquipmentManagement({ open, onClose }: EquipmentManagementProps) {
  const [activeTab, setActiveTab] = useState<'equipment' | 'categories'>('equipment')
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category_id: '',
    price_per_hour: '',
    condition: 'Good',
    image_url: '',
    enabled: true
  })
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    enabled: true
  })

  const { data: equipment } = useEquipmentItems()
  const { data: categories } = useEquipmentCategories()
  const createItem = useCreateEquipmentItem()
  const updateItem = useUpdateEquipmentItem()
  const deleteItem = useDeleteEquipmentItem()
  const createCategory = useCreateEquipmentCategory()
  const updateCategory = useUpdateEquipmentCategory()
  const deleteCategory = useDeleteEquipmentCategory()

  const handleCreateItem = () => {
    if (!newItem.name) return

    createItem.mutate({
      name: newItem.name,
      description: newItem.description || null,
      category_id: newItem.category_id || null,
      price_per_hour: newItem.price_per_hour ? parseFloat(newItem.price_per_hour) : null,
      condition: newItem.condition || null,
      image_url: newItem.image_url || null,
      enabled: newItem.enabled
    })

    setNewItem({
      name: '',
      description: '',
      category_id: '',
      price_per_hour: '',
      condition: 'Good',
      image_url: '',
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

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this equipment item?')) {
      deleteItem.mutate(id)
    }
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory.mutate(id)
    }
  }

  const handleToggleItemStatus = (id: string, enabled: boolean) => {
    updateItem.mutate({
      id,
      updates: { enabled: !enabled }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Equipment & Categories Management</DialogTitle>
          <DialogDescription>
            Manage your rental equipment inventory and categories
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === 'equipment' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('equipment')}
            className="flex-1"
          >
            Equipment Items
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

        {activeTab === 'equipment' && (
          <div className="space-y-6">
            {/* Add New Equipment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Equipment name"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Select
                    value={newItem.category_id}
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, category_id: value }))}
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
                    placeholder="Price per hour"
                    value={newItem.price_per_hour}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price_per_hour: e.target.value }))}
                  />
                  <Select
                    value={newItem.condition}
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Image URL (optional)"
                    value={newItem.image_url}
                    onChange={(e) => setNewItem(prev => ({ ...prev, image_url: e.target.value }))}
                  />
                </div>
                <div className="mt-4">
                  <Button onClick={handleCreateItem} disabled={!newItem.name}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Equipment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Equipment List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Equipment Inventory</CardTitle>
                <CardDescription>
                  {equipment?.length || 0} equipment items configured
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price/Hour</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipment?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{item.name}</div>
                              {item.description && (
                                <div className="text-sm text-muted-foreground truncate max-w-xs">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.equipment_categories?.name || 'No category'}
                        </TableCell>
                        <TableCell>
                          {item.price_per_hour ? `$${item.price_per_hour}` : 'Free'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.condition || 'Good'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleItemStatus(item.id, item.enabled || false)}
                          >
                            <Badge variant={item.enabled ? 'success' : 'secondary'}>
                              {item.enabled ? 'Available' : 'Disabled'}
                            </Badge>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
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
                <CardTitle className="text-lg">Equipment Categories</CardTitle>
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
