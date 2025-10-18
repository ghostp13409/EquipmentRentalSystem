import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { equipmentService, Equipment } from '../../services/equipmentService';
import { rentalService, Rental } from '../../services/rentalService';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';

const EquipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEquipmentDetails();
    }
  }, [id]);

  const loadEquipmentDetails = async () => {
    try {
      setLoading(true);
      const equipmentData = await equipmentService.getById(parseInt(id!));
      setEquipment(equipmentData);

      // Load rental history for admins
      if (role === 'Admin') {
        const rentalHistory = await rentalService.getEquipmentHistory(parseInt(id!));
        setRentals(rentalHistory);
      }
    } catch (err) {
      setError('Failed to load equipment details');
      console.error('Error loading equipment details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueEquipment = () => {
    if (!equipment) return;
    navigate(`/rentals/issue/${equipment.id}`);
  };

  const handleEditEquipment = () => {
    navigate(`/equipment/${equipment?.id}/edit`);
  };

  const handleDeleteEquipment = async () => {
    if (!equipment) return;

    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await equipmentService.delete(equipment.id);
        navigate('/equipment');
      } catch (err) {
        console.error('Error deleting equipment:', err);
        setError('Failed to delete equipment');
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

  if (error || !equipment) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || 'Equipment not found'}</p>
        <Button onClick={() => navigate('/equipment')} className="mt-4">
          Back to Equipment List
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle={`Equipment Details - ${equipment.name}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Details Card */}
        <div className="lg:col-span-2">
          <ComponentCard title="">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {equipment.name}
                </h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  equipment.isAvailable
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {equipment.isAvailable ? 'Available' : 'Rented'}
                </span>
              </div>

              <div className="flex gap-2">
                {role === 'User' && equipment.isAvailable && (
                  <Button
                    onClick={handleIssueEquipment}
                    variant="primary"
                  >
                    Issue Equipment
                  </Button>
                )}

                {role === 'Admin' && (
                  <>
                    <Button
                      onClick={handleEditEquipment}
                      variant="outline"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={handleDeleteEquipment}
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
                  Equipment Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <p className="text-gray-900 dark:text-white">{equipment.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Daily Rate
                    </label>
                    <p className="text-gray-900 dark:text-white">${equipment.rentalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Condition
                    </label>
                    <p className="text-gray-900 dark:text-white">{equipment.condition}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Created At
                    </label>
                    <p className="text-gray-900 dark:text-white">{new Date(equipment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{equipment.description}</p>
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

      {/* Rental History (Admin Only) */}
      {role === 'Admin' && (
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
                        Customer
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
                          {rental.customer?.name || `Customer ${rental.customerId}`}
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
      )}
    </>
  );
};

export default EquipmentDetails;