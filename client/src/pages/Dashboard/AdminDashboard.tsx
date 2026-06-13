import { useState, useEffect } from 'react';
import { equipmentService } from '../../services/equipmentService';
import { rentalService } from '../../services/rentalService';
import { customerService } from '../../services/customerService';
import { Rental } from '../../services/rentalService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    rentedEquipment: 0,
    totalCustomers: 0,
    activeRentals: 0,
    overdueRentals: 0,
  });
  const [recentRentals, setRecentRentals] = useState<Rental[]>([]);
  const [overdueRentals, setOverdueRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load equipment stats
      const [allEquipment, availableEquipment, rentedEquipment] = await Promise.all([
        equipmentService.getAll(),
        equipmentService.getAvailable(),
        equipmentService.getRented(),
      ]);

      // Load customer stats
      const customers = await customerService.getAll();

      // Load rental stats
      const [activeRentals, overdueRentals] = await Promise.all([
        rentalService.getActive(),
        rentalService.getOverdue(),
      ]);

      // Get recent rentals (last 5)
      const allRentals = await rentalService.getAll();
      const recentRentals = allRentals.slice(0, 5);

      setStats({
        totalEquipment: allEquipment.length,
        availableEquipment: availableEquipment.length,
        rentedEquipment: rentedEquipment.length,
        totalCustomers: customers.length,
        activeRentals: activeRentals.length,
        overdueRentals: overdueRentals.length,
      });

      setRecentRentals(recentRentals);
      setOverdueRentals(overdueRentals.slice(0, 5)); // Show first 5 overdue
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Equipment</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEquipment}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Equipment</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.availableEquipment}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rented Equipment</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rentedEquipment}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Rentals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeRentals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Rentals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overdueRentals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Rentals */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Rentals</h3>
          <div className="space-y-3">
            {recentRentals.length > 0 ? (
              recentRentals.map((rental) => (
                <div key={rental.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {rental.equipment?.name || 'Unknown Equipment'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {rental.customer?.name || 'Unknown Customer'}
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
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent rentals</p>
            )}
          </div>
        </div>

        {/* Overdue Rentals Alert */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overdue Rentals</h3>
          <div className="space-y-3">
            {overdueRentals.length > 0 ? (
              overdueRentals.map((rental) => (
                <div key={rental.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {rental.equipment?.name || 'Unknown Equipment'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {rental.customer?.name || 'Unknown Customer'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                      Overdue
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Issued: {new Date(rental.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No overdue rentals</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}