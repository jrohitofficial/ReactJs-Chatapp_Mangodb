import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../redux/features/modal';

function Logout() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  return (
    <div
      className={`
        ${modal.signout ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
    >
      <div
        aria-hidden
        className={`${
          !modal.signout && 'scale-0'
        } transition w-[400px] m-6 p-4 rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-2xl font-bold mb-1">Sign Out</h1>
        <p>Are you sure you want to Sign Out?</p>
        <span className="flex gap-2 mt-5 justify-end">
          <button
            type="button"
            className="py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-spill-700"
            onClick={() => {
              dispatch(setModal({ target: 'signout' }));
            }}
          >
            <p>Cancel</p>
          </button>
          <button
            type="button"
            className="py-2 px-4 rounded-md bg-sky-600 hover:bg-sky-700"
            onClick={() => {
              // delete access token
              localStorage.removeItem('token');
              // close modal
              dispatch(setModal({ target: 'signout' }));

              // reload & display auth page after 0.5s
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }}
          >
            <p className="font-bold text-white">Sign Out</p>
          </button>
        </span>
      </div>
    </div>
  );
}

export default Logout;
