import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProfileViewedState = {
  views: { [vepariId: string]: number };
};

const initialState: ProfileViewedState = {
  views:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("profileViews") || "{}")
      : {},
};

const profileViewedSlice = createSlice({
  name: "profileViewed",
  initialState,
  reducers: {
    increaseClick: (state, action: PayloadAction<string>) => {
      const vepariId = action.payload;
      state.views[vepariId] = (state.views[vepariId] || 0) + 1;
      if (typeof window !== "undefined") {
        localStorage.setItem("profileViews", JSON.stringify(state.views));
      }
    },
    setViews: (state, action: PayloadAction<{ [vepariId: string]: number }>) => {
      state.views = action.payload;
    },
  },
});

// Updated selector to get views for specific vepari
export const profileClickCount = (state: { profileViewed: ProfileViewedState }, vepariId: string) => 
  state.profileViewed.views[vepariId] || 0;

export const { increaseClick, setViews } = profileViewedSlice.actions;

export default profileViewedSlice.reducer;
