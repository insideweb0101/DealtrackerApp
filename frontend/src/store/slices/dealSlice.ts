import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Deal {
  id: string;
  title: string;
  value: number;
  status: string;
  owner_id: string;
  client_name: string;
  expected_close_date: string;
  probability: number;
  created_at: string;
}

interface DealState {
  deals: Deal[];
  selectedDeal: Deal | null;
  loading: boolean;
  error: string | null;
}

const initialState: DealState = {
  deals: [],
  selectedDeal: null,
  loading: false,
  error: null,
};

const dealSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDeals: (state, action: PayloadAction<Deal[]>) => {
      state.deals = action.payload;
      state.loading = false;
    },
    addDeal: (state, action: PayloadAction<Deal>) => {
      state.deals.push(action.payload);
    },
    updateDeal: (state, action: PayloadAction<Deal>) => {
      const index = state.deals.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.deals[index] = action.payload;
      }
    },
    deleteDeal: (state, action: PayloadAction<string>) => {
      state.deals = state.deals.filter((d) => d.id !== action.payload);
    },
    setSelectedDeal: (state, action: PayloadAction<Deal | null>) => {
      state.selectedDeal = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setDeals,
  addDeal,
  updateDeal,
  deleteDeal,
  setSelectedDeal,
  setError,
} = dealSlice.actions;
export default dealSlice.reducer;
