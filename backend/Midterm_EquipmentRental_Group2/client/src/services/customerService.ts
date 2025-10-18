import apiClient from './apiClient';

export interface Customer {
  id: number;
  name: string;
  username: string;
  email?: string;
  role: string;
  createdAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  username: string;
  password: string;
  role: string;
  email?: string;
}

export interface UpdateCustomerRequest {
  name: string;
  username: string;
  password?: string;
  role?: string;
  email?: string;
}

export const customerService = {
  // Get all customers (Admin only)
  getAll: async (): Promise<Customer[]> => {
    const response = await apiClient.get('/customer');
    return response.data;
  },

  // Get customer by ID
  getById: async (id: number): Promise<Customer> => {
    const response = await apiClient.get(`/customer/${id}`);
    return response.data;
  },

  // Get customer's rentals
  getRentals: async (customerId: number) => {
    const response = await apiClient.get(`/customer/${customerId}/rentals`);
    return response.data;
  },

  // Get customer's active rental
  getActiveRental: async (customerId: number) => {
    const response = await apiClient.get(`/customer/${customerId}/active-rental`);
    return response.data;
  },

  // Create customer (Admin only)
  create: async (customer: CreateCustomerRequest): Promise<Customer> => {
    const response = await apiClient.post('/customer', customer);
    return response.data;
  },

  // Update customer
  update: async (id: number, customer: UpdateCustomerRequest): Promise<Customer> => {
    console.log('[customerService.update] Called with id:', id);
    console.log('[customerService.update] Customer data:', customer);
    
    // Build request matching backend UpdateCustomerDto requirements
    const updateData = {
      name: customer.name,
      email: customer.email || '',
      username: customer.username,
      password: customer.password || '',
      role: customer.role || '',
    };
    
    console.log('[customerService.update] Sending to API:', updateData);
    console.log('[customerService.update] URL:', `/customer/${id}`);
    
    try {
      const response = await apiClient.put(`/customer/${id}`, updateData);
      console.log('[customerService.update] Response received:', response);
      return response.data;
    } catch (error) {
      console.error('[customerService.update] Error occurred:', error);
      throw error;
    }
  },

  // Delete customer (Admin only)
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/customer/${id}`);
  },
};