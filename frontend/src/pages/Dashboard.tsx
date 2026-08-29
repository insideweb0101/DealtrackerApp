import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setDeals, setLoading } from '../store/slices/dealSlice';
import { dealService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { deals } = useSelector((state: RootState) => state.deals);

  useEffect(() => {
    const fetchDeals = async () => {
      dispatch(setLoading(true));
      try {
        const response = await dealService.getAll();
        dispatch(setDeals(response.data));
      } catch (error) {
        console.error('Error fetching deals', error);
      }
    };

    fetchDeals();
  }, [dispatch]);

  // Calculate pipeline data
  const pipelineData = [
    {
      status: 'Prospecting',
      count: deals.filter((d) => d.status === 'prospecting').length,
      value: deals
        .filter((d) => d.status === 'prospecting')
        .reduce((sum, d) => sum + d.value, 0),
    },
    {
      status: 'Qualified',
      count: deals.filter((d) => d.status === 'qualified').length,
      value: deals
        .filter((d) => d.status === 'qualified')
        .reduce((sum, d) => sum + d.value, 0),
    },
    {
      status: 'Negotiating',
      count: deals.filter((d) => d.status === 'negotiating').length,
      value: deals
        .filter((d) => d.status === 'negotiating')
        .reduce((sum, d) => sum + d.value, 0),
    },
    {
      status: 'Won',
      count: deals.filter((d) => d.status === 'won').length,
      value: deals.filter((d) => d.status === 'won').reduce((sum, d) => sum + d.value, 0),
    },
  ];

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const wonValue = deals
    .filter((d) => d.status === 'won')
    .reduce((sum, d) => sum + d.value, 0);
  const winRate = deals.length > 0 ? ((deals.filter((d) => d.status === 'won').length / deals.length) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm font-medium">Total Deals</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{deals.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm font-medium">Pipeline Value</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">${(totalValue / 1000).toFixed(1)}K</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm font-medium">Won Value</p>
          <p className="text-3xl font-bold text-green-600 mt-2">${(wonValue / 1000).toFixed(1)}K</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm font-medium">Win Rate</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{winRate}%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pipeline Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pipelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
            <Bar dataKey="value" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
