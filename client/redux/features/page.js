import { createSlice } from '@reduxjs/toolkit';

const PageSlice = createSlice({
  name: 'page',
  initialState: {
    profile: false,
    contact: false,
    setting: false,
    selectParticipant: false,
    friendProfile: false,
    groupProfile: false,
    groupParticipant: false,
    addParticipant: false,
  },
  reducers: {
    /* eslint-disable no-param-reassign */
    setPage(state, action) {
      const { target = null, data = null } = action.payload;
      state[target] = data ?? !state[target];
    },
    /* eslint-enable no-param-reassign */
  },
});

export const { setPage } = PageSlice.actions;
export default PageSlice.reducer;
