import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import * as ri from 'react-icons/ri';
// redux actions
import { setPage } from '../redux/features/page';
import { setModal } from '../redux/features/modal';
import { setChatRoom } from '../redux/features/room';

import { setSetting } from '../redux/features/user';

function Contact() {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.user.setting);
  const page = useSelector((state) => state.page);
  const refreshContact = useSelector((state) => state.chore.refreshContact);
  const chatRoom = useSelector((state) => state.room.chat);

  const [contacts, setContacts] = useState(null);

  const handleGetContacts = async (signal) => {
    try {
      // get contacts if contact page is opened
      if (page.contact) {
        const { data } = await axios.get('/contacts', { signal });
        setContacts(data.payload);
      } else {
        // reset when page is closed
        setContacts(null);
      }
    } catch (error0) {
      console.error(error0.message);
    }
  };

  const handleSortToggle = async () => {
    try {
      setContacts(null);
      await axios.put('/settings', {
        sortContactByName: !setting.sortContactByName,
      });

      dispatch(
        setSetting({
          ...setting,
          sortContactByName: !setting.sortContactByName,
        })
      );

      await handleGetContacts();
    } catch (error0) {
      console.error(error0.message);
    }
  };

  const charTag = (name, prev = null) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const upper = name[0].toUpperCase();

    if (chars.includes(upper) && (!prev || upper !== prev[0].toUpperCase())) {
      return upper;
    }

    if (!chars.includes(upper) && !prev) {
      return '#';
    }

    return null;
  };

  useEffect(() => {
    const ctrl = new AbortController();
    handleGetContacts(ctrl.signal);

    return () => {
      ctrl.abort();
    };
  }, [page.contact, refreshContact]);

  return (
    <div
      className={`
        ${page.contact ? 'delay-75' : '-translate-x-full'}
        transition duration-200 absolute w-full h-full z-20 grid grid-rows-[auto_1fr] overflow-hidden
        bg-white dark:bg-spill-900 dark:text-white/90
      `}
    >
      {/* header */}
      <div className="h-16 px-2 grid grid-cols-[1fr_auto] gap-4">
        <div className="flex gap-4 items-center">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
            onClick={() => {
              dispatch(setPage({ target: 'contact' }));
            }}
          >
            <bi.BiArrowBack className="text-2xl" />
          </button>
          <h1 className="text-2xl font-bold">Contacts</h1>
        </div>
        <div className="flex items-center">
          {page.contact && (
            <button
              type="button"
              className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
              onClick={handleSortToggle}
            >
              <i className="text-2xl">
                {setting && setting.sortContactByName ? (
                  <bi.BiSortDown />
                ) : (
                  <bi.BiSortAZ />
                )}
              </i>
            </button>
          )}
        </div>
      </div>
      {/* content */}
      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
        <div className="grid">
          {[
            {
              target: 'selectParticipant',
              text: 'Create a new Group',
              icon: <ri.RiGroupLine />,
            },
            {
              target: 'newcontact',
              text: 'New Contact',
              icon: <ri.RiUserAddLine />,
            },
          ].map((elem) => (
            <div
              key={elem.target}
              className="grid grid-cols-[auto_1fr] gap-6 p-4 items-center cursor-pointer border-0 border-b border-solid border-spill-200 dark:border-spill-800 hover:bg-spill-100/60 dark:hover:bg-spill-800/60"
              aria-hidden
              onClick={(e) => {
                e.stopPropagation();

                if (elem.target === 'newcontact') {
                  dispatch(
                    setModal({ target: elem.target, data: { username: '' } })
                  );
                } else {
                  dispatch(setPage({ target: elem.target }));
                }
              }}
            >
              <i>{elem.icon}</i>
              <p className="font-bold">{elem.text}</p>
            </div>
          ))}
        </div>
        <div className="pb-16 md:pb-0 grid">
          <div className="py-2 px-4 text-sm bg-spill-100/60 dark:bg-black/20">
            {contacts ? (
              <div className="pr-2 opacity-80 flex justify-between">
                <p>
                  {setting?.sortContactByName
                    ? 'Sorted by name'
                    : 'Sorted by last seen time'}
                </p>
                <p className="font-bold">{contacts.length}</p>
              </div>
            ) : (
              <p className="opacity-80">Loading...</p>
            )}
          </div>
          {contacts &&
            contacts.map((elem, i, arr) => (
              <div
                key={elem._id}
                aria-hidden
                className={`${
                  chatRoom.data?.roomId === elem.roomId &&
                  'bg-spill-100/60 dark:bg-spill-800/60'
                } grid grid-cols-[auto_auto_1fr] gap-4 p-4 items-center cursor-pointer border-0 border-b border-solid border-spill-200 dark:border-spill-800 hover:bg-spill-100/60 dark:hover:bg-spill-800/60`}
                onClick={(e) => {
                  e.stopPropagation();

                  dispatch(
                    setChatRoom({
                      isOpen: true,
                      refreshId: elem.roomId,
                      data: {
                        ownersId: [elem.userId, elem.friendId],
                        roomId: elem.roomId,
                        roomType: 'private',
                        profile: !elem.profile
                          ? {
                              avatar: 'default-avatar.png',
                              fullname: '[inactive]',
                              updatedAt: new Date().toISOString(),
                              active: false,
                            }
                          : {
                              ...elem.profile,
                              active: true,
                            },
                      },
                    })
                  );
                }}
              >
                {setting && setting.sortContactByName && (
                  <span className="flex justify-center">
                    {charTag(
                      elem.profile.fullname,
                      arr[i - 1]?.profile.fullname
                    ) ? (
                      <h1 className="font-bold text-lg">
                        {charTag(
                          elem.profile.fullname,
                          arr[i - 1]?.profile.fullname
                        ) ?? ''}
                      </h1>
                    ) : (
                      <h1 className="invisible">$</h1>
                    )}
                  </span>
                )}
                <img
                  src={
                    elem.profile?.avatar || 'assets/images/default-avatar.png'
                  }
                  alt=""
                  className="w-14 h-14 rounded-full"
                />
                <span className="overflow-hidden">
                  <h1 className="truncate text-lg font-bold">
                    {elem.profile?.fullname ?? '[inactive]'}
                  </h1>
                  {!setting.sortContactByName ? (
                    <p className="truncate opacity-60 mt-0.5">
                      {elem.profile.online
                        ? 'online'
                        : `Last seen ${moment(
                            elem.profile.updatedAt
                          ).fromNow()}`}
                    </p>
                  ) : (
                    <p className="truncate opacity-60 mt-0.5">
                      {elem.profile.bio}
                    </p>
                  )}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Contact;
