import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { customerService, Customer } from '../../services/customerService';
import { Rental } from '../../services/rentalService';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCustomerDetails();
    }
  }, [id]);

  const loadCustomerDetails = async () => {
    try {
      setLoading(true);
      const customerData = await customerService.getById(parseInt(id!));
      setCustomer(customerData);

      // Load rental history
      const rentalHistory = await customerService.getRentals(parseInt(id!));
      setRentals(rentalHistory);
    } catch (err) {
      setError('Failed to load customer details');
      console.error('Error loading customer details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = () => {
    navigate(`/customers/${customer?.id}/edit`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2); // Take up to 2 initials
  };

  const handleDeleteCustomer = async () => {
    if (!customer) return;

    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.delete(customer.id);
        toast.success('Customer deleted successfully!');
        navigate('/customers');
      } catch (err) {
        console.error('Error deleting customer:', err);
        const errorMessage = typeof err === 'string' ? err : 'Failed to delete customer';
        toast.error(errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || 'Customer not found'}</p>
        <Button onClick={() => navigate('/customers')} className="mt-4">
          Back to Customer List
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle={`Customer Details - ${customer.name}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Details Card */}
        <div className="lg:col-span-2">
          <ComponentCard title="">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {customer.name}
                </h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  customer.role === 'Admin'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {customer.role}
                </span>
              </div>

              <div className="flex gap-2">
                {isAdmin() && (
                  <>
                    <Button
                      onClick={handleEditCustomer}
                      variant="outline"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={handleDeleteCustomer}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username
                    </label>
                    <p className="text-gray-900 dark:text-white">@{customer.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <p className="text-gray-900 dark:text-white">{customer.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <p className="text-gray-900 dark:text-white">{customer.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Joined At
                    </label>
                    <p className="text-gray-900 dark:text-white">{new Date(customer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Rental Statistics
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Rentals
                    </label>
                    <p className="text-gray-900 dark:text-white">{rentals.length}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Rentals
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {rentals.filter(r => r.status === 'Active').length}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Completed Rentals
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {rentals.filter(r => r.status === 'Returned').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Customer Avatar Placeholder */}
        <div>
          <ComponentCard title="Customer Avatar">
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-4xl font-bold">
                {getInitials(customer.name)}
              </span>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Rental History */}
      <div className="mt-6">
        <ComponentCard title="Rental History">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Rental History
          </h3>
          {rentals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Equipment
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Rental Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Return Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {rentals.map((rental) => (
                    <tr key={rental.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {rental.equipment?.name || `Equipment ${rental.equipmentId}`}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(rental.issuedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {rental.dueDate ? new Date(rental.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {rental.returnedAt ? new Date(rental.returnedAt).toLocaleDateString() : 'Not returned'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          rental.status === 'Active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : rental.status === 'Returned'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {rental.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No rental history available</p>
          )}
        </ComponentCard>
      </div>
    </>
  );
};

export default CustomerDetails;