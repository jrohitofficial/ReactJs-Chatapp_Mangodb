import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import QRCode from 'qrcode';
import { setModal } from '../../redux/features/modal';
import config from '../../config';

function QR() {
  const dispatch = useDispatch();
  const {
    user: { master },
    modal: { qr },
  } = useSelector((state) => state);

  const generateQRCode = async () => {
    if (qr) {
      // create a new canvas element
      const canvas = document.createElement('canvas');
      const parent = document.querySelector('#qr #canvas-wrap');

      parent.append(canvas);

      await QRCode.toCanvas(canvas, master.qrCode, { width: 200 });
    } else {
      const parent = document.querySelector('#qr #canvas-wrap');

      if (parent) {
        // remove canvas element
        const canvas = parent.querySelector('canvas');
        canvas.remove();
      }
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [!!qr]);

  return (
    <div
      id="qr"
      className={`
        ${qr ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/60
      `}
    >
      <div
        aria-hidden
        className={`${
          !qr && 'scale-0'
        } transition w-[460px] m-6 grid rounded-md bg-white dark:bg-spill-800`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {qr && (
          <>
            <div className="h-16 pl-4 pr-2 grid grid-cols-[1fr_auto] gap-4 items-center">
              <div className="flex gap-4 items-center overflow-hidden">
                <img
                  src={qr.avatar || 'assets/images/default-avatar.png'}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <span className="truncate">
                  <p className="truncate font-bold">{qr.fullname}</p>
                  <p className="truncate text-sm opacity-80">{qr.bio}</p>
                </span>
              </div>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-700"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setModal({ target: 'qr' }));
                }}
              >
                <i>
                  <bi.BiX />
                </i>
              </button>
            </div>
            <div className="group relative p-2 flex justify-center items-center bg-spill-100 dark:bg-spill-700">
              <div id="canvas-wrap"></div>
            </div>
            <p className="p-4 text-sm">{`Your QR code is private, if you share it with someone, they can scan it with their ${config.brandName} camera to add you as a contact.`}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default QR;
