import { createSlice } from '@reduxjs/toolkit';

const ChoreSlice = createSlice({
  name: 'chore',
  initialState: {
    selectedParticipants: [],
    selectedChats: null,
    refreshFriendProfile: null,
    refreshAvatar: null,
    refreshGroupAvatar: null,
    refreshContact: null,
    refreshInbox: null,
  },
  reducers: {
    /* eslint-disable no-param-reassign */
    setSelectedParticipants(state, action) {
      state.selectedParticipants = action.payload ?? [];
    },
    setSelectedChats(state, action) {
      const str = typeof action.payload === 'string';

      if (str) {
        const chats = state.selectedChats ?? [];

        state.selectedChats = !chats.includes(action.payload)
          ? [...chats, action.payload]
          : chats.filter((el) => el !== action.payload);
      } else {
        state.selectedChats = action.payload;
      }
    },
    setRefreshFriendProfile(state, action) {
      state.refreshFriendProfile = action.payload;
    },
    setRefreshAvatar(state, action) {
      state.refreshAvatar = action.payload;
    },
    setRefreshGroupAvatar(state, action) {
      state.refreshGroupAvatar = action.payload;
    },
    setRefreshContact(state, action) {
      state.refreshContact = action.payload;
    },
    setRefreshInbox(state, action) {
      state.refreshInbox = action.payload;
    },
    /* eslint-enable no-param-reassign */
  },
});

export const {
  setSelectedParticipants,
  setSelectedChats,
  setRefreshFriendProfile,
  setRefreshAvatar,
  setRefreshGroupAvatar,
  setRefreshContact,
  setRefreshInbox,
} = ChoreSlice.actions;

export default ChoreSlice.reducer;
