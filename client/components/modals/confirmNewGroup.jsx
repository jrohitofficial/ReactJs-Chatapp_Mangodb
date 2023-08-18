import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import { setModal } from '../../redux/features/modal';
import socket from '../../helpers/socket';
import { setSelectedParticipants } from '../../redux/features/chore';

function ConfirmNewGroup() {
  const dispatch = useDispatch();
  const {
    user: { master },
    chore: { selectedParticipants },
    modal,
  } = useSelector((state) => state);

  const [respond, setRespond] = useState({ success: true, message: null });
  const [form, setForm] = useState({ name: '', desc: '' });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.emit(
      'group/create',
      {
        ...form,
        adminId: master._id,
        participantsId: [
          master._id,
          ...selectedParticipants.map(({ friendId }) => friendId),
        ],
      },
      (res) => {
        const { success, message } = res;

        if (success) {
          // set local state
          setForm({ name: '', desc: '' });
          setRespond({ success, message });

          setTimeout(() => {
            // reset selected participants
            dispatch(setSelectedParticipants([]));

            dispatch(
              setModal({
                target: 'newGroup',
                data: null,
              })
            );
          }, 1000);
        } else {
          // set error response
          setRespond({ success, message });
        }
      }
    );
  };

  return (
    <div
      id="new-group"
      className={`
        ${modal.newGroup ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
      aria-hidden
      onClick={() => {
        setRespond({ success: true, message: null });
        setForm({ name: '', desc: '' });
      }}
    >
      <div
        aria-hidden
        className={`${
          !modal.newGroup && 'scale-0'
        } transition w-[460px] m-6 p-4 grid rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* header */}
        <div>
          <h1 className="text-2xl font-bold">New Group</h1>
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
        {modal.newGroup && (
          <form method="post" className="mt-4 grid" onSubmit={handleSubmit}>
            <span className="grid gap-2">
              {[
                {
                  target: 'name',
                  placeholder: 'Group name',
                  required: true,
                  minLength: 3,
                  maxLength: 32,
                },
                {
                  target: 'desc',
                  placeholder: 'Description for Group',
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
                    minLength={elem.minLength}
                    maxLength={elem.maxLength}
                    required={elem.required}
                    placeholder={elem.placeholder}
                    value={form[elem.target]}
                    className={`${
                      form[elem.target].length > 0
                        ? 'peer valid:bg-spill-50 dark:valid:bg-spill-900'
                        : ''
                    } w-full py-2 pl-4 pr-12 border border-solid border-spill-300 dark:border-spill-500 rounded-md focus:border-black dark:focus:border-sky-400`}
                    onChange={handleChange}
                  />
                  <bi.BiCheck className="absolute right-0 text-xl text-sky-600 dark:text-sky-400 hidden peer-valid:block -translate-x-4" />
                  <bi.BiX className="absolute right-0 text-xl text-red-600 dark:text-red-400 hidden peer-invalid:block -translate-x-4" />
                </label>
              ))}
            </span>
            <div className="mt-4 py-2 rounded-md overflow-hidden bg-spill-100 dark:bg-spill-900">
              <p className="px-4 opacity-60">{`Participants: ${selectedParticipants.length}`}</p>
              <div className="relative flex items-center">
                {/* previous button for participants preview */}
                <button
                  type="button"
                  className="absolute left-0 z-10 p-1 rounded-full translate-x-1 shadow-lg bg-white dark:bg-spill-700"
                  onClick={() => {
                    const preview = document.querySelector(
                      '#new-group #participants-preview'
                    );
                    preview.scrollTo({
                      left: preview.scrollLeft - 112,
                      behavior: 'smooth',
                    });
                  }}
                >
                  <i className="pointer-events-none">
                    <bi.BiChevronLeft />
                  </i>
                </button>
                {/* participants preview */}
                <div
                  aria-hidden
                  id="participants-preview"
                  className="relative mt-2 px-4 flex gap-4 items-center overflow-x-auto scrollbar-none"
                >
                  {selectedParticipants.map((elem) => (
                    <div
                      key={elem._id}
                      className="flex-none pointer-events-none flex flex-col items-center"
                    >
                      <img
                        src={
                          elem.profile.avatar ||
                          'assets/images/default-avatar.png'
                        }
                        alt=""
                        className="w-14 h-14 rounded-full"
                      />
                      <p className="mt-1 text-sm opacity-60">
                        {(() => {
                          const name = elem.profile.fullname;
                          const shortName = name.slice(0, 6).trim();

                          return shortName;
                        })()}
                      </p>
                    </div>
                  ))}
                </div>
                {/* next button for participants preview */}
                <button
                  type="button"
                  className="absolute right-0 z-10 p-1 rounded-full -translate-x-1 shadow-lg bg-white dark:bg-spill-700"
                  onClick={() => {
                    const preview = document.querySelector(
                      '#new-group #participants-preview'
                    );
                    preview.scrollTo({
                      left: preview.scrollLeft + 112,
                      behavior: 'smooth',
                    });
                  }}
                >
                  <i className="pointer-events-none">
                    <bi.BiChevronRight />
                  </i>
                </button>
              </div>
            </div>
            <span className="flex gap-2 mt-4 justify-end">
              <button
                type="button"
                className="py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-spill-700"
                onClick={() => {
                  dispatch(setModal({ target: 'newGroup' }));

                  setRespond({ success: true, message: null });
                  setForm({ name: '', desc: '' });
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

export default ConfirmNewGroup;
