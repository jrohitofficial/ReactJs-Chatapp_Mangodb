import { createSlice } from '@reduxjs/toolkit';

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    master: null,
    setting: null,
  },
  reducers: {
    /* eslint-disable no-param-reassign */
    setMaster(state, action) {
      state.master = action.payload;
    },
    setSetting(state, action) {
      state.setting = action.payload;
    },
    /* eslint-enable no-param-reassign */
  },
});

export const { setMaster, setSetting } = UserSlice.actions;
export default UserSlice.reducer;
