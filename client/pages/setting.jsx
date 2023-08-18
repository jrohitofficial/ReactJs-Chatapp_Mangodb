import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';

import { setSetting } from '../redux/features/user';
import { setPage } from '../redux/features/page';
import { setModal } from '../redux/features/modal';
import { getSetting } from '../api/services/setting.api';

function Setting() {
  const dispatch = useDispatch();

  const setting = useSelector((state) => state.user.setting);
  const page = useSelector((state) => state.page);

  const structure = [
    {
      section: '',
      child: [
        {
          target: 'dark',
          title: 'Dark mode',
          desc: null,
          toggle: true,
          icon: <bi.BiBrightnessHalf />,
        },
      ],
    },
    {
      section: 'Account',
      child: [
        {
          target: 'changePass',
          title: 'Change password',
          desc: null,
          toggle: false,
          icon: <bi.BiKey />,
        },
        {
          target: 'deleteAcc',
          title: 'Delete account',
          desc: null,
          toggle: false,
          icon: <bi.BiTrash />,
        },
      ],
    },
    {
      section: 'Chat',
      child: [
        {
          target: 'enterToSend',
          title: 'Enter to send message',
          desc: 'Enter key will send your message.',
          toggle: true,
          icon: <bi.BiPaperPlane />,
        },
        {
          target: 'keepArchived',
          title: 'Keep archived',
          desc: 'Archived chats will remain archived when you receive a new messages.',
          toggle: true,
          icon: <bi.BiArchive />,
        },
      ],
    },
    {
      section: 'Notification',
      child: [
        {
          target: 'mute',
          title: 'Mute',
          desc: 'Turn off notifications for everyone',
          toggle: true,
          icon: <bi.BiBellOff />,
        },
      ],
    },
    {
      section: 'Help',
      child: [
        {
          target: 'feedback',
          title: 'Feedback',
          desc: 'Please Go Through 📧 jharohit.com.np',
          toggle: false,
          icon: <bi.BiMessageDetail />,
        },
        {
          target: 'terms',
          title: 'Terms & privacy policy',
          desc: null,
          toggle: false,
          icon: <bi.BiCheckShield />,
        },
        {
          target: 'license',
          title: 'License',
          desc: null,
          toggle: false,
          icon: <bi.BiInfoCircle />,
        },
      ],
    },
  ];

  return (
    <div
      className={`
        ${page.setting ? 'delay-75' : '-translate-x-full'}
        transition duration-200 absolute w-full h-full z-20 select-none grid grid-rows-[auto_1fr] overflow-hidden
        bg-white dark:bg-spill-900 dark:text-white/90
      `}
      id="setting"
    >
      {/* header */}
      <div className="h-16 px-2 flex gap-4 items-center">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
          onClick={() => {
            dispatch(setPage({ target: 'setting' }));
          }}
        >
          <bi.BiArrowBack className="text-2xl" />
        </button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <div className="pb-16 md:pb-0 grid gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
        {setting &&
          structure.map((struct) => (
            <div key={struct.section} className="grid">
              <h1 className="font-bold ml-4">{struct.section}</h1>
              {struct.child.map((child) => (
                <div
                  key={child.target}
                  aria-hidden
                  className="p-4 grid grid-cols-[auto_1fr_auto] items-start gap-6 cursor-pointer border-0 border-b border-solid border-spill-200 dark:border-spill-800 hover:bg-spill-100/60 dark:hover:bg-spill-800/60"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setModal({ target: child.target }));
                  }}
                >
                  <i>{child.icon}</i>
                  <span>
                    <p>{child.title}</p>
                    {child.desc && (
                      <p className="mt-1 text-sm opacity-60">{child.desc}</p>
                    )}
                  </span>
                  <span className="grid grid-cols-[auto_auto] gap-2 items-center">
                    <i id="spinner" className="animate-spin invisible">
                      <bi.BiLoaderAlt size={18} />
                    </i>
                    {child.toggle && (
                      <button
                        type="button"
                        className={`
                              ${
                                setting[child.target]
                                  ? 'bg-sky-200 dark:bg-sky-400'
                                  : 'bg-spill-200 dark:bg-spill-700'
                              }
                              flex relative p-1 w-10 rounded-full
                            `}
                        onClick={async (e) => {
                          try {
                            const spinner =
                              e.target.parentElement.querySelector('#spinner');
                            spinner.classList.remove('invisible');

                            const update = {
                              [child.target]: !setting[child.target],
                            };

                            dispatch(setSetting({ ...setting, ...update }));

                            await axios.put('/settings', update);

                            const refresh = await getSetting();
                            dispatch(
                              setSetting(refresh ?? { ...setting, ...update })
                            );

                            spinner.classList.add('invisible');
                          } catch (error0) {
                            console.log(error0.message);
                          }
                        }}
                      >
                        <span
                          className={`
                                ${
                                  setting[child.target]
                                    ? 'bg-sky-600 dark:bg-sky-900 translate-x-4'
                                    : 'bg-spill-600 dark:bg-spill-300'
                                }
                                transition block w-4 h-4 rounded-full pointer-events-none
                              `}
                        ></span>
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Setting;
