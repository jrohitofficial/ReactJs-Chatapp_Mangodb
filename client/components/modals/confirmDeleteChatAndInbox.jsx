import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { setModal } from '../../redux/features/modal';
import { setRefreshInbox } from '../../redux/features/chore';
import { setChatRoom } from '../../redux/features/room';

function ConfirmDeleteChatAndInbox() {
  const dispatch = useDispatch();
  const confirmDeleteChatAndInbox = useSelector(
    (state) => state.modal.confirmDeleteChatAndInbox
  );
  const chatRoom = useSelector((state) => state.room.chat);

  const handleDeleteChatAndInbox = async () => {
    try {
      await axios.delete(`/chats/${confirmDeleteChatAndInbox.roomId}`);

      dispatch(setRefreshInbox(uuidv4()));

      if (
        confirmDeleteChatAndInbox.inboxId === chatRoom.isOpen &&
        chatRoom.data._id
      ) {
        dispatch(
          setChatRoom({
            isOpen: false,
            refreshId: null,
            data: null,
          })
        );
      }

      setTimeout(() => {
        // close confirm-delete-inbox modal
        dispatch(
          setModal({
            target: 'confirmDeleteChatAndInbox',
            data: false,
          })
        );
      }, 300);
    } catch (error0) {
      console.error(error0.message);
    }
  };

  return (
    <div
      className={`
        ${
          confirmDeleteChatAndInbox
            ? 'delay-75 z-50'
            : '-z-50 opacity-0 delay-300'
        }
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
    >
      <div
        aria-hidden
        className={`${
          !confirmDeleteChatAndInbox && 'scale-0'
        } transition relative w-[400px] m-6 p-4 rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-2xl font-bold mb-1">Delete Chat</h1>
        <p>Are you sure you want to delete this chat?</p>
        <span className="mt-4 flex gap-2 justify-end">
          <button
            type="button"
            className="py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-spill-700"
            onClick={() => {
              dispatch(
                setModal({ target: 'confirmDeleteChatAndInbox', data: false })
              );
            }}
          >
            <p>Cancel</p>
          </button>
          <button
            type="button"
            className="py-2 px-4 rounded-md text-white bg-rose-600 hover:bg-rose-700"
            onClick={handleDeleteChatAndInbox}
          >
            <p className="font-bold">Delete Chat</p>
          </button>
        </span>
      </div>
    </div>
  );
}

export default ConfirmDeleteChatAndInbox;
