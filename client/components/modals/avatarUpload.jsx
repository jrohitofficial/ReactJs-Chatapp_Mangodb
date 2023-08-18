import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import { setModal } from '../../redux/features/modal';
import base64Encode from '../../helpers/base64Encode';
import config from '../../config';

function AvatarUpload() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const [respond, setRespond] = useState({ success: true, message: null });

  const handleGallery = async (e) => {
    try {
      const file = e.target.files[0];

      if (file.size >= config.avatarUploadLimit) {
        const errData = {
          message: 'File too large. (max. 2 MB)',
        };
        throw errData;
      }

      const base64 = await base64Encode(file);
      setRespond({ success: true, message: null });

      dispatch(
        setModal({
          target: 'imageCropper',
          data: {
            targetId: modal.avatarUpload.targetId,
            isGroup: modal.avatarUpload.isGroup,
            src: base64,
            back: 'avatarUpload',
          },
        })
      );
    } catch ({ message }) {
      setRespond({
        success: false,
        message,
      });
    }
  };

  return (
    <div
      className={`
        ${modal.avatarUpload ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
    >
      <div
        aria-hidden
        className={`${
          !modal.avatarUpload && 'scale-0'
        } transition w-[460px] m-6 p-4 rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* header */}
        <div>
          <h1 className="text-2xl font-bold">
            {modal.avatarUpload.isGroup ? 'Group Photo' : 'Profile Photo'}
          </h1>
          {respond.message && (
            <p
              className={`mt-1 text-sm ${
                !respond.success && 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {respond.message}
            </p>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <label
            htmlFor="gallery"
            className="w-full p-4 rounded-md cursor-pointer flex flex-col justify-center items-center bg-spill-100/60 dark:bg-spill-900/40 hover:bg-spill-200/80 dark:hover:bg-spill-900/80 border border-solid border-spill-400 dark:border-spill-600"
          >
            <i>
              <bi.BiImage size={40} />
            </i>
            <p className="mt-1 opacity-60">Gallery</p>
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              name="avatar"
              id="gallery"
              className="hidden"
              onChange={handleGallery}
            />
          </label>
          <button
            type="button"
            className="w-full p-4 rounded-md flex flex-col justify-center items-center bg-spill-100/60 dark:bg-spill-900/40 hover:bg-spill-200/80 dark:hover:bg-spill-900/80 border border-solid border-spill-400 dark:border-spill-600"
            onClick={() => {
              dispatch(
                setModal({
                  target: 'webcam',
                  data: { back: 'avatarUpload' },
                })
              );
            }}
          >
            <i>
              <bi.BiCamera size={40} />
            </i>
            <p className="mt-1 opacity-60">Camera</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarUpload;
