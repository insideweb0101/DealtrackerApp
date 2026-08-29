import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Alert {
  id: string;
  deal_id: string;
  type: string;
  message: string;
  severity: string;
  is_read: boolean;
  created_at: string;
}

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: AlertState = {
  alerts: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.alerts = action.payload;
      state.unreadCount = action.payload.filter((a) => !a.is_read).length;
      state.loading = false;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (alert && !alert.is_read) {
        alert.is_read = true;
        state.unreadCount -= 1;
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setAlerts, addAlert, markAsRead, setError } = alertSlice.actions;
export default alertSlice.reducer;
