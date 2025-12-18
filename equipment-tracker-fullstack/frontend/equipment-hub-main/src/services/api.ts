const API_BASE = '/api';

export interface Equipment {
  id: number;
  name: string;
  type: 'Machine' | 'Vessel' | 'Tank' | 'Mixer';
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  lastCleanedDate: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type EquipmentInput = Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  details?: string[];
}

export async function getEquipment(): Promise<Equipment[]> {
  const response = await fetch(`${API_BASE}/equipment`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch equipment');
  }
  const result: ApiResponse<Equipment[]> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch equipment');
  }
  return result.data;
}

export async function addEquipment(equipment: EquipmentInput): Promise<Equipment> {
  const response = await fetch(`${API_BASE}/equipment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(equipment),
  });
  const result: ApiResponse<Equipment> = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || result.details?.join(', ') || 'Failed to add equipment');
  }
  return result.data;
}

export async function updateEquipment(id: number, equipment: Partial<EquipmentInput>): Promise<Equipment> {
  const response = await fetch(`${API_BASE}/equipment/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(equipment),
  });
  const result: ApiResponse<Equipment> = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || result.details?.join(', ') || 'Failed to update equipment');
  }
  return result.data;
}

export async function deleteEquipment(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/equipment/${id}`, {
    method: 'DELETE',
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to delete equipment');
  }
}
