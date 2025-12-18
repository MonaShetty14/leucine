import { Equipment } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EquipmentTableProps {
  equipment: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

function getStatusVariant(status: Equipment['status']): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Inactive':
      return 'secondary';
    case 'Under Maintenance':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function EquipmentTable({ equipment, onEdit, onDelete, isLoading }: EquipmentTableProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        Loading equipment...
      </div>
    );
  }

  if (equipment.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
        <p className="mb-2">No equipment found.</p>
        <p className="text-sm">Add your first equipment using the form, or try adjusting your filters.</p>
      </div>
    );
  }

  // Mobile card view for small screens
  const MobileCard = ({ item }: { item: Equipment }) => (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-foreground">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.type}</p>
        </div>
        <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
      </div>
      <div className="text-sm text-muted-foreground">
        Last cleaned: {formatDate(item.lastCleanedDate)}
      </div>
      <div className="flex gap-2 pt-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(item)}
          className="flex-1"
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{item.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(item.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile view: Cards */}
      <div className="md:hidden space-y-4">
        {equipment.map((item) => (
          <MobileCard key={item.id} item={item} />
        ))}
      </div>

      {/* Desktop view: Table */}
      <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Last Cleaned</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(item.lastCleanedDate)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                      aria-label={`Edit ${item.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="ml-1 hidden lg:inline">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Delete ${item.name}`}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-1 hidden lg:inline">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{item.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(item.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
