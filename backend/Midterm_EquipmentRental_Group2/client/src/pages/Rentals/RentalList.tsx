import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import { rentalService } from '../../services/rentalService';
import { useAuth } from '../../context/AuthContext';
import { Rental } from '../../services/rentalService';
import PageMeta from '../../components/common/PageMeta';
import { Modal } from '../../components/ui/modal';
import DatePicker from '../../components/form/date-picker';

export default function RentalList() {
  const { isAdmin } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [returnFormData, setReturnFormData] = useState({
    conditionOnReturn: 'Good',
    notes: '',
  });
  const [returning, setReturning] = useState(false);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [selectedRentalForExtend, setSelectedRentalForExtend] = useState<Rental | null>(null);
  const [newDueDate, setNewDueDate] = useState('');
  const [extending, setExtending] = useState(false);

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      setLoading(true);
      const data = await rentalService.getAll();
      setRentals(data);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this rental?')) {
      return;
    }

    try {
      await rentalService.cancel(id);
      setRentals(rentals.filter(item => item.id !== id));
      toast.success('Rental cancelled successfully!');
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : 'Failed to cancel rental';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRental) return;

    try {
      setReturning(true);
      await rentalService.return(selectedRental.id, returnFormData.conditionOnReturn, returnFormData.notes);
      // Update the rental in the list
      setRentals(rentals.map(r => r.id === selectedRental.id ? { ...r, status: 'Completed' } : r));
      setReturnModalOpen(false);
      setSelectedRental(null);
      toast.success('Equipment returned successfully!');
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : 'Failed to return rental';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setReturning(false);
    }
  };

  const handleExtendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRentalForExtend || !newDueDate) return;

    try {
      setExtending(true);
      await rentalService.extend(selectedRentalForExtend.id, newDueDate);
      // Update the rental in the list
      setRentals(rentals.map(r => r.id === selectedRentalForExtend.id ? { ...r, dueDate: newDueDate } : r));
      setExtendModalOpen(false);
      setSelectedRentalForExtend(null);
      setNewDueDate('');
      toast.success('Rental extended successfully!');
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : 'Failed to extend rental';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setExtending(false);
    }
  };

  const openExtendModal = (rental: Rental) => {
    if (rental.dueDate) {
      const currentDueDate = new Date(rental.dueDate);
      const tomorrow = new Date(currentDueDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setNewDueDate(tomorrow.toISOString().split('T')[0]);
    }
    setSelectedRentalForExtend(rental);
    setExtendModalOpen(true);
  };

  const getDisplayStatus = (rental: Rental) => {
    if (rental.status === 'Completed') return 'Completed';
    if (rental.returnedAt) return 'Completed';
    if (rental.dueDate && new Date(rental.dueDate) < new Date()) return 'Overdue';
    return rental.status;
  };

  const filteredRentals = rentals.filter(item => {
    const matchesSearch = item.equipment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.customer?.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || getDisplayStatus(item) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statuses = [...new Set(rentals.map(item => getDisplayStatus(item)))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Rental Management" description="Manage equipment rentals" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rental Management</h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search rentals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Rental Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Issued Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRentals.length > 0 ? (
                  filteredRentals.map((rental) => (
                    <tr key={rental.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {rental.equipment?.name || `Equipment ${rental.equipmentId}`}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {rental.equipment?.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {rental.customer?.name || `Customer ${rental.customerId}`}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          @{rental.customer?.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(rental.issuedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {rental.dueDate ? new Date(rental.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          getDisplayStatus(rental) === 'Active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : getDisplayStatus(rental) === 'Completed'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : getDisplayStatus(rental) === 'Overdue'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {getDisplayStatus(rental)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            to={`/rentals/${rental.id}`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            View
                          </Link>
                          {rental.status === 'Active' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedRental(rental);
                                  setReturnFormData({ conditionOnReturn: 'Good', notes: '' });
                                  setReturnModalOpen(true);
                                }}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              >
                                Return
                              </button>
                              {isAdmin() && (
                                <>
                                  <button
                                    onClick={() => openExtendModal(rental)}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    Extend
                                  </button>
                                  <button
                                    onClick={() => handleCancel(rental.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No rentals found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Return Modal */}
        {returnModalOpen && selectedRental && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Return Equipment</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Equipment: {selectedRental.equipment?.name || `Equipment ${selectedRental.equipmentId}`}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customer: {selectedRental.customer?.name || `Customer ${selectedRental.customerId}`}
                </p>
              </div>
              <form onSubmit={handleReturnSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Condition on Return *
                  </label>
                  <select
                    value={returnFormData.conditionOnReturn}
                    onChange={(e) => setReturnFormData(prev => ({ ...prev, conditionOnReturn: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="New">New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Return Notes (Optional)
                  </label>
                  <textarea
                    value={returnFormData.notes}
                    onChange={(e) => setReturnFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    rows={3}
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
                    onClick={() => setReturnModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Extend Modal */}
        <Modal
          isOpen={extendModalOpen}
          onClose={() => setExtendModalOpen(false)}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Extend Rental Due Date
            </h3>
            {selectedRentalForExtend && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Equipment: {selectedRentalForExtend.equipment?.name || `Equipment ${selectedRentalForExtend.equipmentId}`}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customer: {selectedRentalForExtend.customer?.name || `Customer ${selectedRentalForExtend.customerId}`}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current Due Date: {selectedRentalForExtend.dueDate ? new Date(selectedRentalForExtend.dueDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            )}
            <form onSubmit={handleExtendSubmit}>
              <div className="mb-4">
                <DatePicker
                  id="extend-due-date-list"
                  label="New Due Date"
                  defaultDate={newDueDate ? new Date(newDueDate) : undefined}
                  onChange={(selectedDates) => {
                    if (selectedDates && selectedDates[0]) {
                      setNewDueDate(selectedDates[0].toISOString().split('T')[0]);
                    }
                  }}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={extending || !newDueDate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {extending ? 'Extending...' : 'Extend Rental'}
                </button>
                <button
                  type="button"
                  onClick={() => setExtendModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
}