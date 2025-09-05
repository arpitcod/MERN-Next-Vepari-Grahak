import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SuperAdminSearchState {
  query: string;
  activeSection: 'users' | 'vepari' | 'faq';
}

const initialState: SuperAdminSearchState = {
  query: "",
  activeSection: 'users',
};

const superAdminSearchSlice = createSlice({
  name: "superAdminSearch",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setActiveSection: (state, action: PayloadAction<'users' | 'vepari' | 'faq'>) => {
      state.activeSection = action.payload;
    },
    clearSearch: (state) => {
      state.query = "";
    },
  },
});

export const { setSearchQuery, setActiveSection, clearSearch } = superAdminSearchSlice.actions;
export default superAdminSearchSlice.reducer;
