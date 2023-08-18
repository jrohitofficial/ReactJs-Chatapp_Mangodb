import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import { setModal } from '../../redux/features/modal';
import socket from '../../helpers/socket';

function EditGroup() {
  const dispatch = useDispatch();

  const master = useSelector((state) => state.user.master);
  const modal = useSelector((state) => state.modal);

  const [respond, setRespond] = useState({ success: true, message: null });
  const [form, setForm] = useState({ name: '', desc: '' });

  const handleCloseModal = () => {
    // close modal
    dispatch(setModal({ target: 'editGroup', data: false }));

    // reset form and response dialog
    setForm({ name: '', desc: '' });
    setRespond({ success: true, message: null });
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      form.name === modal.editGroup.name &&
      form.desc === modal.editGroup.desc
    ) {
      handleCloseModal();
    }

    socket.emit(
      'group/edit',
      {
        userId: master._id,
        groupId: modal.editGroup._id,
        form,
      },
      (cb) => {
        if (cb.success) {
          setForm({ name: '', desc: '' });
          setRespond(cb);

          setTimeout(() => {
            // close editGroup modal after 500ms (0.5s)
            handleCloseModal();
          }, 500);
        } else {
          setRespond(cb);
        }
      }
    );
  };

  useEffect(() => {
    const group = modal.editGroup;

    setForm((prev) => ({
      ...prev,
      name: group ? group.name : '',
      desc: group ? group.desc : '',
    }));
  }, [modal.editGroup]);

  return (
    <div
      className={`
        ${modal.editGroup ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
      id="edit-group"
      aria-hidden
      onClick={() => handleCloseModal()}
    >
      <div
        aria-hidden
        className={`${
          !modal.editGroup && 'scale-0'
        } transition w-[460px] m-6 p-4 grid rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* header */}
        <div>
          <h1 className="text-2xl font-bold">Edit Group</h1>
          {respond.message && (
            <p
              className={`mt-1 ${
                !respond.success && 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {respond.message}
            </p>
          )}
        </div>
        {modal.editGroup && (
          <form method="post" className="mt-4 grid" onSubmit={handleSubmit}>
            <span className="grid gap-2">
              {[
                {
                  target: 'name',
                  placeholder: 'Group name',
                  required: true,
                  minLength: 1,
                  maxLength: 32,
                },
                {
                  target: 'desc',
                  placeholder: 'Group description (optional)',
                  required: false,
                  minLength: 0,
                  maxLength: 300,
                },
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
                    className={`${
                      form[elem.target].length > 0
                        ? 'peer valid:bg-spill-50 dark:valid:bg-spill-900'
                        : ''
                    } w-full py-2 pl-4 pr-12 border border-solid border-spill-300 dark:border-spill-500 rounded-md focus:border-black dark:focus:border-sky-400`}
                    minLength={elem.minLength}
                    maxLength={elem.maxLength}
                    required={elem.required}
                    placeholder={elem.placeholder}
                    value={form[elem.target]}
                    onChange={handleChange}
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
                  dispatch(setModal({ target: 'editGroup' }));
                }}
              >
                <p>Cancel</p>
              </button>
              <button
                type="submit"
                className="py-2 px-4 rounded-md bg-sky-600 hover:bg-sky-700"
              >
                <p className="font-bold text-white/90">Done</p>
              </button>
            </span>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditGroup;
