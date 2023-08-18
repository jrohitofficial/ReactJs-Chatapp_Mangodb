import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ri from 'react-icons/ri';
import { setModal } from '../../redux/features/modal';

function RecordVoice() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);
  const [recorder, setRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);

  const handleStartRecord = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setRecorder(new MediaRecorder(stream));
    recorder[recorder.state === 'inactive' ? 'start' : 'stop']();

    recorder.ondataavailable = (e) => {
      setChunks(e.data);
    };

    recorder.onstop = () => {
      const audio = document
        .querySelector('#record-voice')
        .querySelector('audio');
      const blob = new Blob(chunks, { type: 'audio/ogg;' });
      const url = URL.createObjectURL(blob);
      audio.src = url;

      console.log(blob);
    };
  };

  return (
    <div
      id="record-voice"
      className={`
        ${modal.recordVoice ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
    >
      <div
        aria-hidden
        className={`${
          !modal.recordVoice && 'scale-0'
        } transition w-[400px] m-6 p-4 rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-2xl font-bold mb-1">Record Voice</h1>
        <audio controls></audio>
        <div className="flex justify-center items-center">
          <button
            type="button"
            className="p-6 rounded-full bg-sky-600"
            onClick={handleStartRecord}
          >
            <i>
              <ri.RiMic2Fill />
            </i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecordVoice;
