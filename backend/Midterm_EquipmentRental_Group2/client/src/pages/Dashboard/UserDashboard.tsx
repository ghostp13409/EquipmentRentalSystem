import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { equipmentService } from '../../services/equipmentService';
import { rentalService } from '../../services/rentalService';
import { customerService } from '../../services/customerService';
import { useAuth } from '../../context/AuthContext';
import { Equipment } from '../../services/equipmentService';
import { Rental } from '../../services/rentalService';

export default function UserDashboard() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [availableEquipment, setAvailableEquipment] = useState<Equipment[]>([]);
  const [myRentals, setMyRentals] = useState<Rental[]>([]);
  const [activeRental, setActiveRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadDashboardData();
    }
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load available equipment
      const available = await equipmentService.getAvailable();
      setAvailableEquipment(available.slice(0, 3)); // Show first 3

      if (userId) {
        // Load user's rentals
        const rentals = await rentalService.getAll();
        const userRentals = rentals.filter(r => r.customerId === userId);
        setMyRentals(userRentals.slice(0, 5)); // Show last 5

        // Load active rental
        const active = await customerService.getActiveRental(userId);
        setActiveRental(active || null);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
      </div>


      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Equipment</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{availableEquipment.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Rentals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{myRentals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Rental</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {activeRental ? activeRental.equipment?.name || 'Unknown Equipment' : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Equipment */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Available Equipment</h3>
          <button
            onClick={() => navigate('/equipment')}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableEquipment.length > 0 ? (
            availableEquipment.map((equipment) => (
              <div key={equipment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{equipment.name}</h4>
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                    Available
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{equipment.category}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{equipment.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${equipment.rentalPrice}/day
                  </span>
                  <button
                    onClick={() => navigate(`/rentals/issue/${equipment.id}`)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Issue
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No equipment available at the moment</p>
            </div>
          )}
        </div>
      </div>

      {/* My Rental History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Rental History</h3>
        <div className="space-y-3">
          {myRentals.length > 0 ? (
            myRentals.map((rental) => (
              <div key={rental.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {rental.equipment?.name || 'Unknown Equipment'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {rental.equipment?.category || 'Unknown Category'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(rental.issuedAt).toLocaleDateString()}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    rental.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  }`}>
                    {rental.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No rental history yet</p>
          )}
        </div>
      </div>
    </div>
  );
}