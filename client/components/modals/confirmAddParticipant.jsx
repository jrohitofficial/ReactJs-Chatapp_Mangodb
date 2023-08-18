import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../redux/features/modal';
import socket from '../../helpers/socket';
import { setSelectedParticipants } from '../../redux/features/chore';
import { setPage } from '../../redux/features/page';

function ConfirmAddParticipant() {
  const dispatch = useDispatch();
  const {
    chore: { selectedParticipants },
    modal,
    user: { master },
  } = useSelector((state) => state);

  const handleSubmit = () => {
    const { groupId, roomId } = modal.confirmAddParticipant;

    socket.emit('group/add-participants', {
      userId: master._id,
      friendsId: selectedParticipants.map((elem) => elem.friendId),
      roomId,
      groupId,
    });

    dispatch(setSelectedParticipants([]));

    setTimeout(() => {
      dispatch(setPage({ target: 'addParticipant', data: false }));

      setTimeout(() => {
        dispatch(
          setModal({
            target: 'confirmAddParticipants',
            data: false,
          })
        );
      }, 500);
    }, 500);
  };

  return (
    <div
      id="confirm-add-participant"
      className={`
        ${
          modal.confirmAddParticipant
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
          !modal.confirmAddParticipant && 'scale-0'
        } transition w-[400px] m-6 p-4 grid rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-2xl font-bold mb-1">Add Participants</h1>
        <p>Are you sure to add these contacts as a group participants?</p>
        <div className="flex gap-2 mt-4 justify-end">
          <button
            type="button"
            className="py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-spill-700"
            onClick={() => {
              dispatch(setModal({ target: 'confirmAddParticipant' }));
            }}
          >
            <p>Cancel</p>
          </button>
          <button
            type="button"
            className="py-2 px-4 rounded-md bg-sky-600 hover:bg-sky-700"
            onClick={handleSubmit}
          >
            <p className="font-bold text-white">Done</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmAddParticipant;
