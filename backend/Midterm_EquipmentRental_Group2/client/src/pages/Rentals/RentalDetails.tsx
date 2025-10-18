import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { rentalService, Rental } from '../../services/rentalService';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';
import { Modal } from '../../components/ui/modal';
import DatePicker from '../../components/form/date-picker';

const RentalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [newDueDate, setNewDueDate] = useState('');

  useEffect(() => {
    if (id) {
      loadRentalDetails();
    }
  }, [id]);

  const loadRentalDetails = async () => {
    try {
      setLoading(true);
      const rentalData = await rentalService.getById(parseInt(id!));
      setRental(rentalData);
    } catch (err) {
      setError('Failed to load rental details');
      console.error('Error loading rental details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnEquipment = () => {
    if (!rental) return;
    navigate(`/rentals/${rental.id}/return`);
  };

  const handleCancelRental = async () => {
    if (!rental) return;

    if (window.confirm('Are you sure you want to cancel this rental?')) {
      try {
        await rentalService.cancel(rental.id);
        navigate('/rentals');
      } catch (err) {
        console.error('Error canceling rental:', err);
        setError('Failed to cancel rental');
      }
    }
  };

  const handleExtendRental = async () => {
    if (!rental || !newDueDate) return;

    try {
      await rentalService.extend(rental.id, newDueDate);
      setIsExtendModalOpen(false);
      setNewDueDate('');
      loadRentalDetails(); // Reload to show updated due date
    } catch (err) {
      console.error('Error extending rental:', err);
      setError('Failed to extend rental due date');
    }
  };

  const openExtendModal = () => {
    if (rental?.dueDate) {
      const currentDueDate = new Date(rental.dueDate);
      const tomorrow = new Date(currentDueDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setNewDueDate(tomorrow.toISOString().split('T')[0]); // Set tomorrow as default
    }
    setIsExtendModalOpen(true);
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
        <Button onClick={() => navigate('/rentals')} className="mt-4">
          Back to Rental List
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle={`Rental Details - ${rental.equipment?.name || `Equipment ${rental.equipmentId}`}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rental Details Card */}
        <div className="lg:col-span-2">
          <ComponentCard title="">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Rental #{rental.id}
                </h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  rental.status === 'Active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : rental.status === 'Returned'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : rental.status === 'Overdue'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {rental.status}
                </span>
              </div>

              <div className="flex gap-2">
                {rental.status === 'Active' && (
                  <>
                    <Button
                      onClick={handleReturnEquipment}
                      variant="primary"
                    >
                      Return Equipment
                    </Button>
                    {isAdmin() && (
                      <>
                        <Button
                          onClick={openExtendModal}
                          variant="outline"
                          className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          Extend Due Date
                        </Button>
                        <Button
                          onClick={handleCancelRental}
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          Cancel Rental
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Equipment Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Equipment Name
                    </label>
                    <p className="text-gray-900 dark:text-white">{rental.equipment?.name || `Equipment ${rental.equipmentId}`}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <p className="text-gray-900 dark:text-white">{rental.equipment?.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Issued Date
                    </label>
                    <p className="text-gray-900 dark:text-white">{new Date(rental.issuedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Due Date
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {rental.dueDate ? new Date(rental.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  {rental.returnedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Returned Date
                      </label>
                      <p className="text-gray-900 dark:text-white">{new Date(rental.returnedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Customer Name
                    </label>
                    <p className="text-gray-900 dark:text-white">{rental.customer?.name || `Customer ${rental.customerId}`}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username
                    </label>
                    <p className="text-gray-900 dark:text-white">@{rental.customer?.username}</p>
                  </div>
                  {rental.conditionOnReturn && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Condition on Return
                      </label>
                      <p className="text-gray-900 dark:text-white">{rental.conditionOnReturn}</p>
                    </div>
                  )}
                  {rental.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notes
                      </label>
                      <p className="text-gray-900 dark:text-white">{rental.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Equipment Image Placeholder */}
        <div>
          <ComponentCard title="Equipment Image">
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">No image available</span>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Extend Due Date Modal */}
      <Modal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Extend Rental Due Date
          </h3>
          <div className="space-y-4">
            <DatePicker
              id="extend-due-date"
              label="New Due Date"
              defaultDate={newDueDate ? new Date(newDueDate) : undefined}
              onChange={(selectedDates) => {
                if (selectedDates && selectedDates[0]) {
                  setNewDueDate(selectedDates[0].toISOString().split('T')[0]);
                }
              }}
            />
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setIsExtendModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExtendRental}
                variant="primary"
                disabled={!newDueDate}
              >
                Extend Rental
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RentalDetails;