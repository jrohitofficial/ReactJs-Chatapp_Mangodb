import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import axios from 'axios';
import { setModal } from '../../redux/features/modal';

function DeleteAccount() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const [respond, setRespond] = useState({ success: true, message: null });
  const [password, setPassword] = useState('');

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete('/users', { data: { password } });
      // set success response
      setRespond({ success: true, message: data.message });

      // delete token and close modal after 0.5s
      setTimeout(() => {
        // delete access token
        localStorage.removeItem('token');
        dispatch(setModal({ target: 'deleteAcc' }));

        // reload & display auth page after 1s
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }, 1000);
    } catch (error0) {
      // set error response
      setRespond({
        success: false,
        message: error0.response.data.message,
      });
    }
  };

  return (
    <div
      className={`
        ${modal.deleteAcc ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
      aria-hidden
      onClick={() => {
        setRespond({ success: true, message: null });
        setPassword('');
      }}
    >
      <div
        aria-hidden
        className={`${
          !modal.deleteAcc && 'scale-0'
        } transition w-[460px] m-6 p-4 grid rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-2xl font-bold">Delete Account</h1>
        <blockquote className="my-2 p-2 border-0 border-l-2 border-solid border-rose-600 bg-rose-50 dark:bg-rose-400/20">
          <p className="text-rose-900 dark:text-rose-100">
            This is extremely important.
          </p>
        </blockquote>
        <p className="mb-4">
          Once your account is deleted, all of your data will be permanently
          gone, including your profile, contacts, and chats.
        </p>
        <p>Enter your password to confirm.</p>
        <label htmlFor="username" className="mt-2 relative flex items-center">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            minLength="6"
            className={`${
              password.length > 0
                ? 'peer valid:bg-spill-50 dark:valid:bg-spill-900'
                : ''
            } w-full py-2 pl-4 pr-12 border border-solid border-spill-300 dark:border-spill-500 rounded-md focus:border-black dark:focus:border-sky-400`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <bi.BiCheck className="absolute right-0 text-xl text-sky-600 dark:text-sky-400 hidden peer-valid:block -translate-x-4" />
          <bi.BiX className="absolute right-0 text-xl text-red-600 dark:text-red-400 hidden peer-invalid:block -translate-x-4" />
        </label>
        {respond.message && (
          <p
            className={`${
              !respond.success && 'text-rose-800 dark:text-rose-400'
            } text-sm mt-2`}
          >
            {respond.message}
          </p>
        )}
        <span className="flex gap-2 mt-4 justify-end">
          <button
            type="button"
            className="py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-spill-700"
            onClick={() => {
              dispatch(setModal({ target: 'deleteAcc' }));

              setRespond({ success: true, message: null });
              setPassword('');
            }}
          >
            <p>Cancel</p>
          </button>
          <button
            type="button"
            className="py-2 px-4 rounded-md bg-rose-600 hover:bg-rose-700"
            onClick={handleDelete}
          >
            <p className="font-bold text-white/90">Delete account</p>
          </button>
        </span>
      </div>
    </div>
  );
}

export default DeleteAccount;
