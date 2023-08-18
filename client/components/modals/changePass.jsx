import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import axios from 'axios';
import { setModal } from '../../redux/features/modal';

function ChangePass() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const [respond, setRespond] = useState({ success: true, message: null });
  const [form, setForm] = useState({
    oldPass: '',
    newPass: '',
    confirmNewPass: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const { data } = await axios.patch('/users/change-pass', form);

      // set success response
      setRespond({ success: true, message: data.message });
      setForm({
        oldPass: '',
        newPass: '',
        confirmNewPass: '',
      });

      // close modal after 1s
      setTimeout(() => {
        dispatch(setModal({ target: 'changePass' }));
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
        ${modal.changePass ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
      aria-hidden
      onClick={() => {
        setRespond({ success: true, message: null });
        setForm({
          oldPass: '',
          newPass: '',
          confirmNewPass: '',
        });
      }}
    >
      <div
        aria-hidden
        className={`${
          !modal.changePass && 'scale-0'
        } transition w-[460px] m-6 p-4 grid rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-2xl font-bold">Password</h1>
        <form method="post" className="mt-4 grid" onSubmit={handleSubmit}>
          {respond.message && (
            <p
              className={`${
                !respond.success && 'text-rose-800 dark:text-rose-400'
              } text-sm mb-2`}
            >
              {respond.message}
            </p>
          )}
          <span className="grid gap-2">
            {[
              { target: 'oldPass', placeholder: 'Old password' },
              { target: 'newPass', placeholder: 'New password' },
              { target: 'confirmNewPass', placeholder: 'Confirm new password' },
            ].map((elem) => (
              <label
                key={elem.target}
                htmlFor={elem.target}
                className={`${
                  elem.target === 'newPass' && 'mt-4'
                } relative flex items-center`}
              >
                <input
                  type={elem.target}
                  name={elem.target}
                  id={elem.target}
                  placeholder={elem.placeholder}
                  minLength="6"
                  className={`${
                    form[elem.target].length > 0
                      ? 'peer valid:bg-spill-50 dark:valid:bg-spill-900'
                      : ''
                  } w-full py-2 pl-4 pr-12 border border-solid border-spill-300 dark:border-spill-500 rounded-md focus:border-black dark:focus:border-sky-400`}
                  value={form[elem.target]}
                  onChange={handleChange}
                  required
                />
                <bi.BiCheck className="absolute right-0 text-xl text-sky-600 dark:text-sky-400 hidden peer-valid:block -translate-x-4" />
                <bi.BiX className="absolute right-0 text-xl text-red-600 dark:text-red-400 hidden peer-invalid:block -translate-x-4" />
              </label>
            ))}
          </span>
          <span className="flex gap-2 mt-4 justify-end">
            <button
              type="button"
              className="py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-spill-700"
              onClick={() => {
                dispatch(setModal({ target: 'changePass' }));

                setRespond({ success: true, message: null });
                setForm({
                  oldPass: '',
                  newPass: '',
                  confirmNewPass: '',
                });
              }}
            >
              <p>Cancel</p>
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-sky-600 hover:bg-sky-700"
            >
              <p className="font-bold text-white/90">Change</p>
            </button>
          </span>
        </form>
      </div>
    </div>
  );
}

export default ChangePass;
