import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { equipmentService, Equipment } from '../../services/equipmentService';
import { rentalService, IssueRentalRequest } from '../../services/rentalService';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';

const RentalIssueForm: React.FC = () => {
  const { equipmentId } = useParams<{ equipmentId: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState({
    rentalDays: 1,
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveRental, setHasActiveRental] = useState(false);

  useEffect(() => {
    if (equipmentId) {
      loadEquipment();
    }
  }, [equipmentId]);

  const loadEquipment = async () => {
    try {
      setLoading(true);

      // Check if user has active rental
      const activeRentals = await rentalService.getActive();
      if (activeRentals.length > 0) {
        setHasActiveRental(true);
        setError('You already have an active rental. Please return it before renting new equipment.');
        return;
      }

      const equipmentData = await equipmentService.getById(parseInt(equipmentId!));
      setEquipment(equipmentData);

      if (!equipmentData.isAvailable) {
        setError('This equipment is not available for rental');
      }
    } catch (err) {
      setError('Failed to load equipment details');
      console.error('Error loading equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rentalDays' ? parseInt(value) || 1 : value,
    }));
  };

  const calculateTotalCost = () => {
    if (!equipment) return 0;
    return equipment.rentalPrice * formData.rentalDays;
  };

  const calculateDueDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + formData.rentalDays);
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!equipment || !userId) return;

    if (formData.rentalDays < 1) {
      setError('Rental period must be at least 1 day');
      return;
    }

    try {
      setIssuing(true);
      setError(null);

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + formData.rentalDays);
      const rentalRequest: IssueRentalRequest = {
        equipmentId: equipment.id,
        customerId: userId,
        dueDate: dueDate.toISOString().split('T')[0],
      };

      await rentalService.issue(rentalRequest);

      toast.success('Equipment rental issued successfully!');
      // Navigate back to equipment list or dashboard
      navigate('/equipment');
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.message || (err as any)?.message || 'Failed to issue equipment rental';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error issuing rental:', err);
    } finally {
      setIssuing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || 'Equipment not found'}</p>
        <button
          onClick={() => navigate('/equipment')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Back to Equipment List
        </button>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle={`Issue Equipment - ${equipment.name}`} />

      <div className="max-w-2xl mx-auto">
        <ComponentCard title="Issue Equipment Rental">
          {/* Equipment Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Equipment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{equipment.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                <p className="font-medium text-gray-900 dark:text-white">{equipment.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Condition</p>
                <p className="font-medium text-gray-900 dark:text-white">{equipment.condition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Daily Rate</p>
                <p className="font-medium text-gray-900 dark:text-white">${equipment.rentalPrice.toFixed(2)}</p>
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
              <label htmlFor="rentalDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rental Period (Days) *
              </label>
              <input
                type="number"
                id="rentalDays"
                name="rentalDays"
                value={formData.rentalDays}
                onChange={handleInputChange}
                min="1"
                max="365"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Any special requirements or notes..."
              />
            </div>

            {/* Rental Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Rental Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Daily Rate:</span>
                  <span className="font-medium text-blue-400">${equipment.rentalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rental Days:</span>
                  <span className="font-medium text-blue-400">{formData.rentalDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                  <span className="font-medium text-blue-400">{new Date(calculateDueDate()).toLocaleDateString()}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span className='text-blue-400'>Total Cost:</span>
                  <span className="text-blue-400">${calculateTotalCost().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={issuing || !equipment.isAvailable || hasActiveRental}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {issuing ? 'Issuing Rental...' : 'Confirm Rental'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/equipment')}
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

export default RentalIssueForm;