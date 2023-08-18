import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import GroupContextMenu from '../components/modals/groupContextMenu';

import { touchAndHoldStart, touchAndHoldEnd } from '../helpers/touchAndHold';
import { setPage } from '../redux/features/page';
import { setModal } from '../redux/features/modal';

function GroupParticipant() {
  const dispatch = useDispatch();
  const {
    user: { master },
    page: { groupParticipant },
    modal,
  } = useSelector((state) => state);

  const [control, setControl] = useState({ skip: 0, limit: 20 });
  const [participants, setParticipants] = useState(null);

  const handleGetParticipants = async (signal) => {
    try {
      if (groupParticipant) {
        // get participants with pagination control
        const { data } = await axios.get(
          `/groups/${groupParticipant._id}/participants`,
          { params: control, signal }
        );

        setParticipants((prev) => {
          // merge new participants data
          if (prev) return [...prev, ...data.payload];
          return data.payload;
        });
      } else {
        // reset participants element
        setTimeout(() => setParticipants(null), 150);
      }
    } catch (error0) {
      console.error(error0.message);
    }
  };

  const handleContextMenu = (e, elem) => {
    if (elem.userId !== master._id && groupParticipant.adminId === master._id) {
      const parent = document.querySelector('#group-participant');

      const y =
        e.clientY > window.innerHeight / 2 ? e.clientY - 136 : e.clientY;
      const x = e.clientX - (window.innerWidth - parent.clientWidth);

      dispatch(
        setModal({
          target: 'groupContextMenu',
          data: {
            group: groupParticipant,
            user: elem,
            x: x > parent.clientWidth / 2 ? x - 160 : x,
            y,
          },
        })
      );
    }
  };

  useEffect(() => {
    const abortCtrl = new AbortController();
    handleGetParticipants(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
    };
  }, [!!groupParticipant, control]);

  return (
    <div
      id="group-participant"
      className={`
        ${!groupParticipant && 'translate-x-full'}
        transition absolute w-full sm:w-[380px] h-full right-0 z-10 grid grid-rows-[auto_1fr] overflow-hidden
        bg-white dark:bg-spill-900
      `}
    >
      {/* group context menu */}
      {groupParticipant && modal.groupContextMenu && <GroupContextMenu />}
      {/* header */}
      <div className="h-16 px-2 flex gap-6 justify-between items-center">
        <div className="flex gap-4 items-center">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
            onClick={() => {
              setControl({ skip: 0, limit: 20 });
              dispatch(setPage({ target: 'groupParticipant', data: false }));
            }}
          >
            <bi.BiArrowBack className="block md:hidden" />
            <bi.BiX className="hidden md:block" />
          </button>
          <h1 className="text-2xl font-bold">Participants</h1>
        </div>
      </div>
      <div className="pb-16 md:pb-0 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
        {participants &&
          participants.map((elem) => (
            <div
              key={elem._id}
              className={`
                ${
                  modal.groupContextMenu?.user?.userId === elem.userId
                    ? 'bg-spill-100/60 dark:bg-spill-800/60'
                    : ''
                }
                p-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center cursor-pointer
                border-0 border-b border-solid border-spill-200 dark:border-spill-800
                hover:bg-spill-100/60 dark:hover:bg-spill-800/60
              `}
              aria-hidden
              onClick={() => {
                if (master._id !== elem.userId) {
                  dispatch(
                    setPage({
                      target: 'friendProfile',
                      data: elem.userId,
                    })
                  );
                }
              }}
              onContextMenu={(e) => {
                e.stopPropagation();
                e.preventDefault();

                handleContextMenu(e, elem);
              }}
              onTouchStart={(e) => {
                touchAndHoldStart(() => handleContextMenu(e, elem));
              }}
              onTouchMove={() => touchAndHoldEnd()}
              onTouchEnd={() => touchAndHoldEnd()}
            >
              <img
                src={elem.avatar || 'assets/images/default-avatar.png'}
                alt=""
                className="w-14 h-14 rounded-full"
              />
              <span className="truncate">
                <h1 className="truncate text-lg font-bold">
                  {elem.fullname}
                  <sup className="ml-1 opacity-60">
                    {master._id === elem.userId && '~You'}
                  </sup>
                </h1>
                <p className="truncate mt-0.5 opacity-60">{elem.bio}</p>
              </span>
              {/* admin tag */}
              {elem.userId === groupParticipant.adminId && (
                <span className="h-full">
                  <p className="font-bold text-xs py-0.5 px-2 rounded-full text-white bg-sky-600">
                    Admin
                  </p>
                </span>
              )}
            </div>
          ))}
        {groupParticipant &&
          participants &&
          participants.length < groupParticipant.participantsId.length && (
            <button
              type="button"
              className="mt-2 md:mb-4 py-2 px-4 flex gap-4 hover:bg-spill-100 dark:hover:bg-spill-800"
              onClick={() => {
                setControl((prev) => ({
                  ...prev,
                  skip: participants.length,
                }));
              }}
            >
              <i>
                <bi.BiChevronDown />
              </i>
              <p>{`${
                groupParticipant.participantsId.length - participants.length
              } more`}</p>
            </button>
          )}
      </div>
    </div>
  );
}

export default GroupParticipant;
