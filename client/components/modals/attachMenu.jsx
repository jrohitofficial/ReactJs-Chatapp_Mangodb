import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import { setModal } from '../../redux/features/modal';
import base64Encode from '../../helpers/base64Encode';

function AttachMenu() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  return (
    <div
      className={`${
        modal.attachMenu ? 'z-10' : 'scale-0 -z-10'
      } transition absolute left-0 bottom-0 w-40 py-2 rounded-md shadow-xl translate-x-12 -translate-y-14 bg-white dark:bg-spill-700`}
      aria-hidden
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid">
        {[
          {
            target: 'photo',
            icon: <bi.BiImageAlt />,
            accept: 'image/png, image/jpg, image/jpeg, image/webp',
          },
          { target: 'file', icon: <bi.BiFile />, accept: '' },
        ].map((elem) => (
          <label
            htmlFor={`attach-${elem.target}`}
            key={elem.target}
            className="py-2 px-4 flex gap-4 items-center cursor-pointer hover:bg-spill-200 dark:hover:bg-spill-600"
          >
            <i className="opacity-80">{elem.icon}</i>
            <p className="font-bold capitalize">{elem.target}</p>
            <input
              type="file"
              id={`attach-${elem.target}`}
              accept={elem.accept}
              className="hidden"
              onChange={async ({ target: { files } }) => {
                if (files.length > 0) {
                  const base64 = await base64Encode(files[0]);

                  dispatch(
                    setModal({
                      target: 'sendFile',
                      data: {
                        type: elem.target === 'photo' ? 'image' : 'all',
                        url: base64,
                        originalname: files[0].name,
                        size: files[0].size,
                      },
                    })
                  );
                }
              }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export default AttachMenu;
