import { createSlice } from '@reduxjs/toolkit';

const ModalSlice = createSlice({
  name: 'modal',
  initialState: {
    minibox: false,
    signout: false,
    newcontact: false,
    changePass: false,
    deleteAcc: false,
    qr: false,
    newGroup: false,
    avatarUpload: false,
    imageCropper: false, // -> { src: String, back: String | null }
    webcam: false, // -> { back: String }
    photoFull: false,
    confirmDeleteChat: false,
    sendFile: false,
    attachMenu: false,
    confirmAddParticipant: false,
    roomHeaderMenu: false,
    editGroup: false,
    confirmExitGroup: false,
    confirmDeleteContact: false,
    inboxMenu: false,
    confirmDeleteChatAndInbox: false,
    groupContextMenu: false,
  },
  reducers: {
    /* eslint-disable no-param-reassign */
    setModal(state, action) {
      const { target = '*', data = null } = action.payload;

      if (target) {
        Object.keys(state).forEach((key) => {
          if (target === key) {
            state[target] = data ?? !state[target];
          } else {
            state[key] = false;
          }
        });
      }
    },
    /* eslint-enable no-param-reassign */
  },
});

export const { setModal } = ModalSlice.actions;
export default ModalSlice.reducer;
