import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { rentalService, Rental } from '../../services/rentalService';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';

const RentalReturnForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [rental, setRental] = useState<Rental | null>(null);
  const [formData, setFormData] = useState({
    conditionOnReturn: 'Good',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadRental();
    }
  }, [id]);

  const loadRental = async () => {
    try {
      setLoading(true);
      const rentalData = await rentalService.getById(parseInt(id!));
      setRental(rentalData);

      if (rentalData.status !== 'Active') {
        setError('This rental is not active and cannot be returned');
      }
    } catch (err) {
      setError('Failed to load rental details');
      console.error('Error loading rental:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rental) return;

    try {
      setReturning(true);
      setError(null);

      console.log('Sending return request:', {
        rentalId: rental.id,
        conditionOnReturn: formData.conditionOnReturn,
        notes: formData.notes,
      });

      const result = await rentalService.return(rental.id, formData.conditionOnReturn, formData.notes);

      console.log('Return successful:', result);
      toast.success('Equipment returned successfully!');

      // Navigate back to rental list
      navigate('/rentals');
    } catch (err) {
      console.error('Error returning rental:', err);
      const errorMessage = (err as any)?.response?.data?.message || (err as any)?.message || 'Failed to return equipment';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setReturning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || 'Rental not found'}</p>
        <button
          onClick={() => navigate('/rentals')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Back to Rental List
        </button>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle={`Return Equipment - ${rental.equipment?.name || `Equipment ${rental.equipmentId}`}`} />

      <div className="max-w-2xl mx-auto">
        <ComponentCard title="Return Equipment">
          {/* Rental Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Rental Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Equipment</p>
                <p className="font-medium text-gray-900 dark:text-white">{rental.equipment?.name || `Equipment ${rental.equipmentId}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                <p className="font-medium text-gray-900 dark:text-white">{rental.customer?.name || `Customer ${rental.customerId}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Issued Date</p>
                <p className="font-medium text-gray-900 dark:text-white">{new Date(rental.issuedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {rental.dueDate ? new Date(rental.dueDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-600 dark:text-red-300">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="conditionOnReturn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Condition on Return *
              </label>
              <select
                id="conditionOnReturn"
                name="conditionOnReturn"
                value={formData.conditionOnReturn}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="New">New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Return Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Any notes about the equipment condition or return..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={returning}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {returning ? 'Processing Return...' : 'Confirm Return'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/rentals')}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
};

export default RentalReturnForm;