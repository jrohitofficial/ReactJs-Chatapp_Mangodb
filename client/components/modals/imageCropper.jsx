import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import Cropper from 'react-easy-crop';

import { setModal } from '../../redux/features/modal';
import {
  setRefreshAvatar,
  setRefreshGroupAvatar,
} from '../../redux/features/chore';

function ImageCropper() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedArea, setCroppedArea] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    try {
      setUploading(true);

      const { src: avatar, isGroup, targetId } = modal.imageCropper;

      const { data } = await axios.post('/avatars', {
        avatar,
        targetId,
        isGroup,
        crop: croppedArea,
        zoom,
      });

      // close imageCropper modal
      dispatch(setModal({ target: 'imageCropper' }));
      // uploaded
      setUploading(false);

      if (isGroup) {
        dispatch(setRefreshGroupAvatar(data.payload));
      } else {
        dispatch(setRefreshAvatar(data.payload));
      }
    } catch (error0) {
      setUploading(false);
    }
  };

  return (
    <div
      aria-hidden
      className="absolute w-full h-full z-50 flex justify-center items-center bg-spill-600/40 dark:bg-black/60"
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setModal({ target: modal.imageCropper.back }));
      }}
    >
      <div
        aria-hidden
        className="w-[460px] m-6 rounded-md overflow-hidden bg-white dark:bg-spill-800"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="h-14 pl-4 pr-2 flex gap-4 justify-between items-center">
          <p className="font-bold text-lg truncate">
            Crop your new profile photo
          </p>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-700"
            onClick={() => {
              dispatch(setModal({ target: modal.imageCropper.back }));
            }}
          >
            <i>
              <bi.BiX />
            </i>
          </button>
        </div>
        <div className="relative w-full h-60 bg-spill-100 dark:bg-spill-950">
          <Cropper
            image={modal.imageCropper.src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onCropComplete={(_, inPixels) => setCroppedArea(inPixels)}
          />
        </div>
        <div className="p-4 grid gap-4">
          <span className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
            <i>
              <bi.BiMinus size={20} />
            </i>
            <input
              type="range"
              name="zoom"
              id="zoom"
              step={0.001}
              min={1}
              max={2}
              defaultValue={zoom}
              className="w-full"
              onChange={(e) => {
                setZoom(e.target.value);
              }}
            />
            <i>
              <bi.BiPlus size={20} />
            </i>
          </span>
          <button
            type="button"
            className="w-full py-2 px-4 rounded-md font-bold text-white bg-sky-600 hover:bg-sky-700"
            onClick={handleUpload}
          >
            {uploading ? 'Uploading...' : 'Set new profile photo'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;
