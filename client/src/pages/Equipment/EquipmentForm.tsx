import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { equipmentService, CreateEquipmentRequest, UpdateEquipmentRequest } from '../../services/equipmentService';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';

const EquipmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState<CreateEquipmentRequest>({
    name: '',
    description: '',
    category: '',
    condition: 'Good',
    rentalPrice: 0,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadEquipment();
    }
  }, [id, isEdit]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const equipment = await equipmentService.getById(parseInt(id!));
      setFormData({
        name: equipment.name,
        description: equipment.description,
        category: equipment.category,
        condition: equipment.condition,
        rentalPrice: equipment.rentalPrice,
      });
    } catch (err) {
      setError('Failed to load equipment');
      console.error('Error loading equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rentalPrice' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category.trim() || formData.rentalPrice <= 0) {
      setError('Please fill in all required fields with valid values');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (isEdit && id) {
        const updateData: UpdateEquipmentRequest = {
          id: parseInt(id),
          ...formData,
        };
        await equipmentService.update(parseInt(id), updateData);
        toast.success('Equipment updated successfully!');
      } else {
        await equipmentService.create(formData);
        toast.success('Equipment created successfully!');
      }

      navigate('/equipment');
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.message || (err as any)?.message || (isEdit ? 'Failed to update equipment' : 'Failed to create equipment');
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error saving equipment:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle={`${isEdit ? 'Edit' : 'Create'} Equipment`} />

      <div className="max-w-2xl mx-auto">
        <ComponentCard title={`${isEdit ? 'Edit' : 'Create'} Equipment`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-600 dark:text-red-300">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Equipment Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter equipment name"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                <option value="HeavyMachinery">Heavy Machinery</option>
                <option value="PowerTools">Power Tools</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Safety">Safety</option>
                <option value="Surveying">Surveying</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter equipment description"
              />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
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
              <label htmlFor="rentalPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daily Rental Rate ($) *
              </label>
              <input
                type="number"
                id="rentalPrice"
                name="rentalPrice"
                value={formData.rentalPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Equipment' : 'Create Equipment')}
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

export default EquipmentForm;