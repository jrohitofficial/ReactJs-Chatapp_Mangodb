import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../redux/features/modal';
import socket from '../../helpers/socket';
import { setChatRoom } from '../../redux/features/room';

function ConfirmExitGroup() {
  const dispatch = useDispatch();

  const master = useSelector((state) => state.user.master);
  const confirmExitGroup = useSelector((state) => state.modal.confirmExitGroup);

  const handleExitGroup = () => {
    socket.emit(
      'group/exit',
      {
        groupId: confirmExitGroup.groupId,
        userId: master._id,
      },
      () => {
        // close confirmExitGroup modal
        dispatch(setModal({ target: 'confirmExitGroup', data: false }));

        setTimeout(() => {
          // close room after 150ms
          dispatch(
            setChatRoom({
              isOpen: false,
              refreshId: null,
              data: null,
            })
          );
        }, 150);
      }
    );
  };

  return (
    <div
      className={`
        ${confirmExitGroup ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
    >
      <div
        aria-hidden
        className={`${
          !confirmExitGroup && 'scale-0'
        } transition relative w-[400px] m-6 p-4 rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-2xl font-bold mb-1">Exit Group</h1>
        <p>
          {'Are you sure you want to exit '}
          <strong>{`"${confirmExitGroup.name}"`}</strong>
          {' group?'}
        </p>
        <span className="mt-4 flex gap-2 justify-end">
          {[
            {
              label: 'Cancel',
              style: 'hover:bg-gray-100 dark:hover:bg-spill-700',
              action: () =>
                dispatch(setModal({ target: 'confirmExitGroup', data: false })),
            },
            {
              label: 'Exit group',
              style: 'font-bold text-white bg-rose-600 hover:bg-rose-700',
              action: () => handleExitGroup(),
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

export default ConfirmExitGroup;
