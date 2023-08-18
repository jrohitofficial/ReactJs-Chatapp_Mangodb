import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as bi from 'react-icons/bi';
import { v4 as uuidv4 } from 'uuid';
import { setModal } from '../../../redux/features/modal';
import { setPage } from '../../../redux/features/page';
import { setRefreshInbox } from '../../../redux/features/chore';

import config from '../../../config';

function Header({ setSearch }) {
  const dispatch = useDispatch();
  const inputTimeout = useRef(null);

  return (
    <div className="grid items-center z-10 bg-white dark:bg-spill-900 dark:text-white/90">
      <div className="h-16 pl-4 pr-2 flex gap-5 justify-between items-center">
        {/* brand name */}
        <h1 className="text-2xl font-bold font-display">{config.brandName}</h1>
        <div className="flex">
          {[
            {
              target: 'refresh-inbox',
              icon: <bi.BiRotateRight />,
              action() {
                dispatch(setRefreshInbox(uuidv4()));
              },
            },
            {
              target: 'contact',
              icon: <bi.BiMessageSquareDots />,
              action() {
                dispatch(setPage({ target: 'contact' }));
              },
            },
            {
              target: 'minibox',
              icon: <bi.BiDotsVerticalRounded />,
              action(e) {
                e.stopPropagation();
                dispatch(setModal({ target: 'minibox' }));
              },
            },
          ].map((elem) => (
            <button
              type="button"
              key={elem.target}
              className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
              onClick={elem.action}
            >
              {elem.icon}
            </button>
          ))}
        </div>
      </div>
      {/* search bar */}
      <div className="px-4 pb-4">
        <label htmlFor="search" className="flex gap-3 items-center">
          <bi.BiSearchAlt />
          <input
            type="text"
            name="search"
            id="search"
            className="w-full placeholder:opacity-80"
            placeholder="Search chats..."
            onChange={(e) => {
              clearTimeout(inputTimeout.current);

              inputTimeout.current = setTimeout(() => {
                if (e.target.value.length < 3) {
                  setSearch('');
                } else {
                  setSearch(e.target.value);
                }
              }, 1000);
            }}
          />
        </label>
      </div>
    </div>
  );
}

export default Header;
