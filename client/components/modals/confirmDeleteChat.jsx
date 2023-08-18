import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../redux/features/modal';
import socket from '../../helpers/socket';

function ConfirmDeleteChat() {
  const dispatch = useDispatch();

  const {
    chore: { selectedChats },
    modal: { confirmDeleteChat: confirmBox },
    room: { chat: chatRoom },
    user: { master },
  } = useSelector((state) => state);

  const [deleteForEveryone, setDeleteForEveryone] = useState(false);

  const handleDeleteChats = () => {
    socket.emit('chat/delete', {
      roomId: chatRoom.data.roomId,
      userId: master._id,
      chatsId: selectedChats,
      deleteForEveryone,
    });
  };

  return (
    <div
      aria-hidden
      className={`
        ${confirmBox ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
      onClick={() => {
        setTimeout(() => {
          setDeleteForEveryone(false);
        }, 150);
      }}
    >
      <div
        aria-hidden
        className={`${
          !confirmBox && 'scale-0'
        } transition relative w-[400px] m-6 p-4 rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-2xl font-bold mb-1">Delete Message</h1>
        <p>Are you sure you want to delete this message?</p>
        <label
          htmlFor="deleteForEveryone"
          className="my-4 flex gap-2 items-center cursor-pointer"
        >
          <input
            type="checkbox"
            name="deleteForEveryone"
            id="deleteForEveryone"
            checked={deleteForEveryone}
            onChange={() => setDeleteForEveryone((prev) => !prev)}
          />
          <p>Delete for everyone</p>
        </label>
        <span className="flex gap-2 justify-end">
          {[
            {
              label: 'Cancel',
              style: 'hover:bg-gray-100 dark:hover:bg-spill-700',
              action: () => {
                dispatch(setModal({ target: 'confirmDeleteChat' }));
                setTimeout(() => {
                  setDeleteForEveryone(false);
                }, 150);
              },
            },
            {
              label: 'Delete',
              style: 'font-bold text-white bg-rose-600 hover:bg-rose-700',
              action: () => handleDeleteChats(),
            },
          ].map((elem) => (
            <button
              key={elem.label}
              type="button"
              className={`${elem.style} py-2 px-4 rounded-md`}
              onClick={() => elem.action()}
            >
              <p>{elem.label}</p>
            </button>
          ))}
        </span>
      </div>
    </div>
  );
}

export default ConfirmDeleteChat;
