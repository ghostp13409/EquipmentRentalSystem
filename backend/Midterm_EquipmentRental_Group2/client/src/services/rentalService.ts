import apiClient from './apiClient';

export interface Rental {
  id: number;
  equipmentId: number;
  customerId: number;
  issuedAt: string;
  returnedAt?: string;
  dueDate?: string;
  conditionOnReturn?: string;
  notes?: string;
  status: string;
  equipment?: {
    id: number;
    name: string;
    category: string;
  };
  customer?: {
    id: number;
    name: string;
    username: string;
  };
}

export interface IssueRentalRequest {
  equipmentId: number;
  customerId?: number; // Optional for admin, required for user
  dueDate: string;
}

export interface ReturnRentalRequest {
  rentalId: number;
  conditionOnReturn: string;
  notes?: string;
}

export interface ExtendRentalRequest {
  rentalId: number;
  newDueDate: string;
}

export const rentalService = {
  // Get all rentals (Admin sees all, User sees their own)
  getAll: async (): Promise<Rental[]> => {
    const response = await apiClient.get('/rental');
    return response.data;
  },

  // Get rental by ID
  getById: async (id: number): Promise<Rental> => {
    const response = await apiClient.get(`/rental/${id}`);
    return response.data;
  },

  // Get active rentals
  getActive: async (): Promise<Rental[]> => {
    const response = await apiClient.get('/rental/active');
    return response.data;
  },

  // Get completed rentals
  getCompleted: async (): Promise<Rental[]> => {
    const response = await apiClient.get('/rental/completed');
    return response.data;
  },

  // Get overdue rentals (Admin only)
  getOverdue: async (): Promise<Rental[]> => {
    const response = await apiClient.get('/rental/overdue');
    return response.data;
  },

  // Get equipment rental history
  getEquipmentHistory: async (equipmentId: number): Promise<Rental[]> => {
    const response = await apiClient.get(`/rental/equipment/${equipmentId}`);
    return response.data;
  },

  // Issue equipment (create rental)
  issue: async (rental: IssueRentalRequest): Promise<Rental> => {
    const response = await apiClient.post('/rental/issue', rental);
    return response.data;
  },

  // Return equipment
  return: async (rentalId: number, conditionOnReturn: string, notes?: string): Promise<Rental> => {
    const response = await apiClient.post('/rental/return', {
      rentalId,
      conditionOnReturn,
      notes,
    });
    return response.data.rental;
  },

  // Extend rental (Admin only)
  extend: async (rentalId: number, newDueDate: string): Promise<Rental> => {
    const response = await apiClient.put(`/rental/${rentalId}`, {
      newDueDate,
      reason: '',
    });
    return response.data;
  },

  // Cancel rental (Admin only)
  cancel: async (rentalId: number): Promise<void> => {
    await apiClient.delete(`/rental/${rentalId}`);
  },
};