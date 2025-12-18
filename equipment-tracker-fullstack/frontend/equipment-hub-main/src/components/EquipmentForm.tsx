import { useState, useEffect } from 'react';
import { Equipment, EquipmentInput } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface EquipmentFormProps {
  editingEquipment: Equipment | null;
  onSubmit: (equipment: EquipmentInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const EQUIPMENT_TYPES = ['Machine', 'Vessel', 'Tank', 'Mixer'] as const;
const STATUS_OPTIONS = ['Active', 'Inactive', 'Under Maintenance'] as const;

export function EquipmentForm({ editingEquipment, onSubmit, onCancel, isLoading }: EquipmentFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Equipment['type']>('Machine');
  const [status, setStatus] = useState<Equipment['status']>('Active');
  const [lastCleanedDate, setLastCleanedDate] = useState('');
  const [errors, setErrors] = useState<{ name?: string; lastCleanedDate?: string }>({});

  useEffect(() => {
    if (editingEquipment) {
      setName(editingEquipment.name);
      setType(editingEquipment.type);
      setStatus(editingEquipment.status);
      setLastCleanedDate(editingEquipment.lastCleanedDate || '');
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingEquipment]);

  const resetForm = () => {
    setName('');
    setType('Machine');
    setStatus('Active');
    setLastCleanedDate('');
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; lastCleanedDate?: string } = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    // Date validation (optional but must be valid if provided)
    if (lastCleanedDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(lastCleanedDate)) {
        newErrors.lastCleanedDate = 'Invalid date format';
      } else {
        const date = new Date(lastCleanedDate);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (date > today) {
          newErrors.lastCleanedDate = 'Date cannot be in the future';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      type,
      status,
      lastCleanedDate: lastCleanedDate || null,
    });

    // Reset form only for new equipment
    if (!editingEquipment) {
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const isValid = name.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
      </h2>

      <div className="grid gap-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name && e.target.value.trim()) {
                setErrors(prev => ({ ...prev, name: undefined }));
              }
            }}
            placeholder="Enter equipment name"
            className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Type Field */}
        <div className="space-y-2">
          <Label htmlFor="type">Type <span className="text-destructive">*</span></Label>
          <Select value={type} onValueChange={(value) => setType(value as Equipment['type'])} disabled={isLoading}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {EQUIPMENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Field */}
        <div className="space-y-2">
          <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
          <Select value={status} onValueChange={(value) => setStatus(value as Equipment['status'])} disabled={isLoading}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Last Cleaned Date Field */}
        <div className="space-y-2">
          <Label htmlFor="lastCleanedDate">Last Cleaned Date</Label>
          <Input
            id="lastCleanedDate"
            type="date"
            value={lastCleanedDate}
            onChange={(e) => {
              setLastCleanedDate(e.target.value);
              if (errors.lastCleanedDate) {
                setErrors(prev => ({ ...prev, lastCleanedDate: undefined }));
              }
            }}
            max={new Date().toISOString().split('T')[0]}
            className={errors.lastCleanedDate ? 'border-destructive focus-visible:ring-destructive' : ''}
            disabled={isLoading}
          />
          {errors.lastCleanedDate && (
            <p className="text-sm text-destructive">{errors.lastCleanedDate}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" disabled={!isValid || isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : editingEquipment ? 'Update Equipment' : 'Add Equipment'}
          </Button>
          {editingEquipment && (
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading} className="w-full sm:w-auto">
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
