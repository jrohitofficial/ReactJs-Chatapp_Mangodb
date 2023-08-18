import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as md from 'react-icons/md';
import { setModal } from '../../redux/features/modal';

function WebCam() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const [videoStreamTrack, setVideoStreamTrack] = useState(null);

  const handleStart = async () => {
    try {
      const wrap = document.querySelector('#webcam #video-wrap');

      if (modal.webcam) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
        const track = stream.getVideoTracks()[0];

        setVideoStreamTrack(track);
        const video = document.createElement('video');
        wrap.append(video);

        video.srcObject = stream;
        video.style.transform = 'rotateY(180deg)';
        video.play();
      }

      if (!modal.webcam && videoStreamTrack) {
        // remove html video element
        wrap.querySelector('video').remove();
        // stop track
        videoStreamTrack.stop();
      }
    } catch (error0) {
      console.error(error0.message);
    }
  };

  const handleSubmit = () => {
    const video = document.querySelector('#webcam').querySelector('video');
    const canvas = document.createElement('canvas');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    // flip horizontally
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const src = canvas.toDataURL();
    dispatch(
      setModal({
        target: 'imageCropper',
        data: { src, back: 'avatarUpload' },
      })
    );
  };

  useEffect(() => {
    handleStart();
  }, [modal.webcam]);

  return (
    <div
      id="webcam"
      aria-hidden
      className={`
        ${modal.webcam ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setModal({ target: modal.webcam.back }));
      }}
    >
      <div
        aria-hidden
        className={`${
          !modal.webcam && 'scale-0'
        } transition relative w-[460px] m-6 rounded-md overflow-hidden bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div id="video-wrap"></div>
        <div className="py-2 absolute bottom-0 w-full flex justify-center">
          <button
            type="button"
            className="w-16 h-16 rounded-full shadow-xl flex justify-center items-center bg-sky-600 hover:brightness-110"
            onClick={handleSubmit}
          >
            <i>
              <md.MdPhotoCamera size={28} />
            </i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WebCam;
