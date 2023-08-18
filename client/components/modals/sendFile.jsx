import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import { setModal } from '../../redux/features/modal';
import socket from '../../helpers/socket';
import bytesToSize from '../../helpers/bytesToSize';

function SendFile() {
  const dispatch = useDispatch();
  const {
    modal: { sendFile },
    room: { chat: chatRoom },
    user: { master },
  } = useSelector((state) => state);

  const [caption, setCaption] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.emit('chat/insert', {
      roomId: chatRoom.data.roomId,
      userId: master._id,
      ownersId: chatRoom.data.ownersId,
      roomType: chatRoom.data.roomType,
      text: caption,
      file: {
        originalname: sendFile.originalname,
        url: sendFile.url,
      },
    });

    setCaption('');

    setTimeout(() => {
      dispatch(setModal({ target: 'sendFile' }));
    }, 500);
  };

  return (
    <div
      className={`
        ${sendFile ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
      aria-hidden
      onClick={() => setCaption('')}
    >
      <div
        aria-hidden
        className={`${
          !sendFile && 'scale-0'
        } transition relative w-[460px] m-6 rounded-md overflow-hidden bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* header */}
        <div className="h-14 pl-4 pr-2 flex gap-4 justify-between items-center">
          <h1 className="text-lg font-bold">{`Send ${
            sendFile.type === 'image' ? 'Photo' : 'File'
          }`}</h1>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-700"
            onClick={(e) => {
              e.stopPropagation();

              setCaption('');
              dispatch(setModal({ target: 'sendFile' }));
            }}
          >
            <i>
              <bi.BiX />
            </i>
          </button>
        </div>
        {sendFile && sendFile.type === 'image' && (
          <div className="p-2 flex justify-center items-center bg-spill-100 dark:bg-spill-950">
            <img src={sendFile.url} alt="" className="max-h-80" />
          </div>
        )}
        {sendFile && sendFile.type === 'all' && (
          <div className="py-2 px-4 flex gap-4 items-center">
            <i>
              <bi.BiFile size={40} />
            </i>
            <span className="truncate">
              <p className="font-bold truncate">{sendFile.originalname}</p>
              <p className="text-sm opacity-60 mt-0.5">
                {bytesToSize(sendFile.size)}
              </p>
            </span>
          </div>
        )}
        <form
          method="post"
          className="h-14 pl-4 pr-2 grid grid-cols-[1fr_auto] gap-4 items-center"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <input
            type="text"
            name="caption"
            id="caption"
            placeholder="Type a message"
            className="w-full"
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
            }}
          />
          <button
            type="submit"
            className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-700"
          >
            <i>
              <bi.BiSend />
            </i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default SendFile;
