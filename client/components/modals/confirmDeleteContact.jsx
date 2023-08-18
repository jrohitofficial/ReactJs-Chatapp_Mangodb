import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { setModal } from '../../redux/features/modal';
import {
  setRefreshContact,
  setRefreshFriendProfile,
} from '../../redux/features/chore';

function ConfirmDeleteContact() {
  const dispatch = useDispatch();
  // friend _id
  const confirmDeleteContact = useSelector(
    (state) => state.modal.confirmDeleteContact
  );

  const handleDeleteContact = async () => {
    try {
      await axios.delete(`/contacts/${confirmDeleteContact}`);

      // close confirmDeleteContact modal
      dispatch(
        setModal({
          target: 'confirmDeleteContact',
          data: false,
        })
      );

      setTimeout(() => {
        // refresh contact and friend's profile page after 150ms
        dispatch(setRefreshContact(uuidv4()));
        dispatch(setRefreshFriendProfile(uuidv4()));
      }, 150);
    } catch (error0) {
      console.error(error0.message);
    }
  };

  return (
    <div
      className={`
        ${confirmDeleteContact ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
    >
      <div
        aria-hidden
        className={`${
          !confirmDeleteContact && 'scale-0'
        } transition relative w-[400px] m-6 p-4 rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-2xl font-bold mb-1">Delete Contact</h1>
        <p>Are you sure you want to delete this contact?</p>
        <span className="flex gap-2 mt-4 justify-end">
          <button
            type="button"
            className="py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-spill-700"
            onClick={() => {
              dispatch(
                setModal({ target: 'confirmDeleteContact', data: false })
              );
            }}
          >
            <p>Cancel</p>
          </button>
          <button
            type="button"
            className="py-2 px-4 rounded-md text-white bg-rose-600 hover:bg-rose-700"
            onClick={handleDeleteContact}
          >
            <p className="font-bold">Delete Contact</p>
          </button>
        </span>
      </div>
    </div>
  );
}

export default ConfirmDeleteContact;
