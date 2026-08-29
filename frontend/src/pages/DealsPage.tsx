import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setDeals, setLoading, addDeal, updateDeal, deleteDeal } from '../store/slices/dealSlice';
import { dealService } from '../services/api';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';

const DealsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { deals, loading } = useSelector((state: RootState) => state.deals);
  const [filter, setFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    value: 0,
    status: 'prospecting',
    client_name: '',
    expected_close_date: '',
    probability: 50,
  });

  useEffect(() => {
    const fetchDeals = async () => {
      dispatch(setLoading(true));
      try {
        const response = await dealService.getAll(filter || undefined);
        dispatch(setDeals(response.data));
      } catch (error) {
        console.error('Error fetching deals', error);
      }
    };

    fetchDeals();
  }, [dispatch, filter]);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await dealService.create(formData);
      dispatch(addDeal(response.data));
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        value: 0,
        status: 'prospecting',
        client_name: '',
        expected_close_date: '',
        probability: 50,
      });
    } catch (error) {
      console.error('Error creating deal', error);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    try {
      await dealService.delete(id);
      dispatch(deleteDeal(id));
    } catch (error) {
      console.error('Error deleting deal', error);
    }
  };

  const statusColors = {
    prospecting: 'bg-gray-100 text-gray-800',
    qualified: 'bg-blue-100 text-blue-800',
    negotiating: 'bg-yellow-100 text-yellow-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Deals</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <MdAdd size={20} />
          <span>New Deal</span>
        </button>
      </div>

      <div className="flex space-x-2">
        {['', 'prospecting', 'qualified', 'negotiating', 'won', 'lost'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : deals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No deals found</div>
        ) : (
          deals.map((deal) => (
            <div key={deal.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{deal.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{deal.client_name}</p>
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Value</p>
                      <p className="text-lg font-bold text-gray-800">${deal.value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Probability</p>
                      <p className="text-lg font-bold text-gray-800">{deal.probability}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Expected Close</p>
                      <p className="text-lg font-bold text-gray-800">
                        {new Date(deal.expected_close_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${statusColors[deal.status as keyof typeof statusColors]}`}>
                        {deal.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteDeal(deal.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Deal</h2>
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <input
                type="text"
                placeholder="Deal Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="text"
                placeholder="Client Name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="number"
                placeholder="Value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="date"
                value={formData.expected_close_date}
                onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Deal
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsPage;
