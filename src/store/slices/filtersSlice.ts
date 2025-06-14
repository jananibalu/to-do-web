import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FiltersState } from '../../types';

const initialState: FiltersState = {
  activeFilter: 'all',
  searchTerm: ''
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setActiveFilter: (state, action: PayloadAction<'all' | 'completed' | 'pending'>) => {
      state.activeFilter = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    }
  }
});

export const { setActiveFilter, setSearchTerm } = filtersSlice.actions;
export default filtersSlice.reducer;