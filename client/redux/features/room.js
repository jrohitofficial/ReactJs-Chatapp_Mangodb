import { createSlice } from '@reduxjs/toolkit';

const RoomSlice = createSlice({
  name: 'room',
  initialState: {
    chat: {
      isOpen: false,
      refreshId: null,
      data: null,
    },
  },
  reducers: {
    /* eslint-disable no-param-reassign */
    setChatRoom(state, action) {
      const { isOpen, refreshId, data } = action.payload;

      state.chat.isOpen = isOpen;
      state.chat.refreshId = refreshId;
      state.chat.data = data;
    },
    /* eslint-enable no-param-reassign */
  },
});

export const { setChatRoom } = RoomSlice.actions;
export default RoomSlice.reducer;
