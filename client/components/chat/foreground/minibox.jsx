import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import { setPage } from '../../../redux/features/page';
import { setModal } from '../../../redux/features/modal';

function Minibox() {
  const dispatch = useDispatch();
  const { user, modal } = useSelector((state) => state);

  return (
    <div
      aria-hidden
      className={`
        ${modal.minibox ? 'opacity-100 z-20' : 'opacity-0 -z-50 scale-50'}
        transition duration-75 absolute right-0 w-40 translate-y-12 -translate-x-6 shadow-xl rounded-md
        bg-white dark:bg-spill-700 dark:text-white/90
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-2 grid">
        {[
          {
            target: 'profile',
            data: user.master._id,
            html: 'Profile',
            icon: <bi.BiUserCircle />,
          },
          { target: 'setting', html: 'Settings', icon: <bi.BiCog /> },
          { target: 'signout', html: 'Sign out', icon: <bi.BiLogOutCircle /> },
        ].map((elem) => (
          <button
            type="button"
            key={elem.target}
            className="py-2 px-4 flex gap-4 items-center hover:bg-spill-100 dark:hover:bg-spill-600"
            onClick={() => {
              // close minibox
              dispatch(setModal({ target: 'minibox' }));

              dispatch(
                elem.target === 'signout'
                  ? setModal({ target: elem.target })
                  : setPage({
                      target: elem.target,
                      data: elem.data,
                    })
              );
            }}
          >
            <i className="opacity-80">{elem.icon}</i>
            <p>{elem.html}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Minibox;
