import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Profile</h1>

      <div className="bg-white p-8 rounded-lg shadow">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="text-lg font-semibold text-gray-800 mt-1 capitalize">{user?.role.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
