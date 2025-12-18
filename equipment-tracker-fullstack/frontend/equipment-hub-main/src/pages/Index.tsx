import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Equipment, EquipmentInput, getEquipment, addEquipment, updateEquipment, deleteEquipment } from '@/services/api';
import { EquipmentForm } from '@/components/EquipmentForm';
import { EquipmentTable } from '@/components/EquipmentTable';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowUpDown, Filter } from 'lucide-react';

type SortField = 'name' | 'type' | 'status' | 'lastCleanedDate';
type SortDirection = 'asc' | 'desc';

const Index = () => {
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch equipment from API
  const { data: equipment = [], isLoading, isError, error } = useQuery({
    queryKey: ['equipment'],
    queryFn: getEquipment,
  });

  // Add mutation
  const addMutation = useMutation({
    mutationFn: addEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      toast({ title: 'Success', description: 'Equipment added successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EquipmentInput> }) => updateEquipment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setEditingEquipment(null);
      toast({ title: 'Success', description: 'Equipment updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      toast({ title: 'Success', description: 'Equipment deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Filter and sort equipment
  const filteredAndSortedEquipment = useMemo(() => {
    let result = [...equipment];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(item => item.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortField] ?? '';
      let bValue = b[sortField] ?? '';

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [equipment, searchQuery, typeFilter, statusFilter, sortField, sortDirection]);

  const handleSubmit = (data: EquipmentInput) => {
    if (editingEquipment) {
      updateMutation.mutate({ id: editingEquipment.id, data });
    } else {
      addMutation.mutate(data);
    }
  };

  const handleEdit = (item: Equipment) => {
    setEditingEquipment(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleCancel = () => {
    setEditingEquipment(null);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-4 sm:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold">Equipment Tracker</h1>
          <p className="text-sm text-primary-foreground/80 mt-1">Manage your equipment inventory</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[350px_1fr]">
          <aside className="order-2 lg:order-1">
            <EquipmentForm
              editingEquipment={editingEquipment}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </aside>

          <section className="order-1 lg:order-2">
            {/* Search and Filter Controls */}
            <div className="bg-card border border-border rounded-lg p-4 mb-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Search Input */}
                <div className="relative sm:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Machine">Machine</SelectItem>
                      <SelectItem value="Vessel">Vessel</SelectItem>
                      <SelectItem value="Tank">Tank</SelectItem>
                      <SelectItem value="Mixer">Mixer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sort Controls */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort by:
                </span>
                {(['name', 'type', 'status', 'lastCleanedDate'] as SortField[]).map((field) => (
                  <button
                    key={field}
                    onClick={() => toggleSort(field)}
                    className={`text-sm px-2 py-1 rounded-md transition-colors ${sortField === field
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                      }`}
                  >
                    {field === 'lastCleanedDate' ? 'Last Cleaned' : field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Equipment List ({filteredAndSortedEquipment.length}
              {filteredAndSortedEquipment.length !== equipment.length && ` of ${equipment.length}`})
            </h2>

            {/* Error State */}
            {isError && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-4 text-destructive">
                Failed to load equipment: {error instanceof Error ? error.message : 'Unknown error'}
              </div>
            )}

            {/* Equipment Table */}
            <EquipmentTable
              equipment={filteredAndSortedEquipment}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
