import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setAlerts, setLoading, markAsRead } from '../store/slices/alertSlice';
import { alertService } from '../services/api';
import { MdCheckCircle, MdInfo, MdWarning, MdError } from 'react-icons/md';

const AlertsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { alerts, loading } = useSelector((state: RootState) => state.alerts);

  useEffect(() => {
    const fetchAlerts = async () => {
      dispatch(setLoading(true));
      try {
        const response = await alertService.getUnread();
        dispatch(setAlerts(response.data));
      } catch (error) {
        console.error('Error fetching alerts', error);
      }
    };

    fetchAlerts();
  }, [dispatch]);

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await alertService.markAsRead(alertId);
      dispatch(markAsRead(alertId));
    } catch (error) {
      console.error('Error marking alert as read', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-l-4 border-red-600';
      case 'high':
        return 'bg-orange-100 border-l-4 border-orange-600';
      case 'medium':
        return 'bg-yellow-100 border-l-4 border-yellow-600';
      case 'low':
        return 'bg-blue-100 border-l-4 border-blue-600';
      default:
        return 'bg-gray-100 border-l-4 border-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <MdError className="text-red-600" size={24} />;
      case 'medium':
        return <MdWarning className="text-yellow-600" size={24} />;
      case 'low':
        return <MdInfo className="text-blue-600" size={24} />;
      default:
        return <MdCheckCircle className="text-gray-600" size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Alerts</h1>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No unread alerts</div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-6 rounded-lg flex items-start justify-between ${getSeverityColor(
                alert.severity
              )}`}
            >
              <div className="flex space-x-4 flex-1">
                <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{alert.type.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {!alert.is_read && (
                <button
                  onClick={() => handleMarkAsRead(alert.id)}
                  className="ml-4 px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-50 font-medium text-sm"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
