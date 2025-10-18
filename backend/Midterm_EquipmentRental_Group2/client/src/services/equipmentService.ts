import apiClient from './apiClient';

export interface Equipment {
  id: number;
  name: string;
  description: string;
  category: string;
  condition: string;
  rentalPrice: number;
  isAvailable: boolean;
  createdAt: string;
}

export interface CreateEquipmentRequest {
  name: string;
  description: string;
  category: string;
  condition: string;
  rentalPrice: number;
}

export interface UpdateEquipmentRequest extends CreateEquipmentRequest {
  id: number;
}

export const equipmentService = {
  // Get all equipment
  getAll: async (): Promise<Equipment[]> => {
    const response = await apiClient.get('/equipment');
    return response.data;
  },

  // Get equipment by ID
  getById: async (id: number): Promise<Equipment> => {
    const response = await apiClient.get(`/equipment/${id}`);
    return response.data;
  },

  // Get available equipment
  getAvailable: async (): Promise<Equipment[]> => {
    const response = await apiClient.get('/equipment/available');
    return response.data;
  },

  // Get rented equipment (Admin only)
  getRented: async (): Promise<Equipment[]> => {
    const response = await apiClient.get('/equipment/rented');
    return response.data;
  },

  // Create equipment (Admin only)
  create: async (equipment: CreateEquipmentRequest): Promise<Equipment> => {
    const response = await apiClient.post('/equipment', equipment);
    return response.data;
  },

  // Update equipment (Admin only)
  update: async (id: number, equipment: UpdateEquipmentRequest): Promise<Equipment> => {
    const response = await apiClient.put(`/equipment/${id}`, equipment);
    return response.data;
  },

  // Delete equipment (Admin only)
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/equipment/${id}`);
  },
};