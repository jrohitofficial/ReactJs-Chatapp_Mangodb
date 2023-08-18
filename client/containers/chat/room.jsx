import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as md from 'react-icons/md';

import { setSelectedChats } from '../../redux/features/chore';
import socket from '../../helpers/socket';
import config from '../../config';

import * as comp from '../../components/chat/room';
import FriendProfile from '../../pages/friendProfile';
import GroupProfile from '../../pages/groupProfile';
import GroupParticipant from '../../pages/groupParticipant';
import AddParticipant from '../../pages/addParticipant';

import { setPage } from '../../redux/features/page';

function Room() {
  const dispatch = useDispatch();
  const {
    user: { master },
    room: { chat: chatRoom },
    page,
  } = useSelector((state) => state);

  const [prevRoom, setPrevRoom] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [chats, setChats] = useState(null);
  const [newMessage, setNewMessage] = useState(0);
  const [control, setControl] = useState({ skip: 0, limit: 20 });

  const handleGetChats = async (signal) => {
    try {
      const { data } = await axios.get(`/chats/${chatRoom.data.roomId}`, {
        params: { skip: 0, limit: control.limit },
        signal,
      });

      if (data.payload.length > 0) {
        setChats(data.payload);

        const callback = (mutationlist, observer) => {
          const monitor = document.querySelector('#monitor');
          monitor.scrollTop = monitor.scrollHeight;

          setLoaded(true);

          observer.disconnect();
        };

        const observer = new MutationObserver(callback);

        const elem = document.querySelector('#monitor-content');
        observer.observe(elem, { childList: true });

        return;
      }

      setLoaded(true);
    } catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  const handleOpenRoom = async (signal) => {
    setLoaded(false);
    setControl({ skip: 0, limit: 20 });
    setChats(null);
    dispatch(setSelectedChats(null));
    dispatch(setPage({ target: 'friendProfile', data: false }));
    dispatch(setPage({ target: 'groupProfile', data: false }));
    dispatch(setPage({ target: 'groupParticipant', data: false }));
    dispatch(setPage({ target: 'addParticipant', data: false }));

    if (chatRoom.isOpen) {
      const { roomType, group, roomId } = chatRoom.data;
      const isGroup = roomType === 'group';

      if (!isGroup || (isGroup && group.participantsId.includes(master._id))) {
        socket.emit('room/open', { prevRoom, newRoom: roomId });
        // get messages
        await handleGetChats(signal);
      } else {
        await handleGetChats(signal);
      }
    }
  };

  useEffect(() => {
    const abortCtrl = new AbortController();
    handleOpenRoom(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
    };
  }, [chatRoom.isOpen, chatRoom.refreshId]);

  useEffect(() => {
    socket.on('room/open', (args) => setPrevRoom(args));

    return () => {
      socket.off('room/open');
    };
  }, []);

  return (
    <div
      className={`
        ${!chatRoom.data && 'translate-x-full md:translate-x-0'}
        transition absolute md:relative flex z-10 w-full h-full overflow-hidden
        bg-spill-100 dark:bg-spill-950
      `}
    >
      {chatRoom.data && (
        <>
          <div
            className={`${
              (page.groupProfile || page.friendProfile) &&
              '-translate-x-full sm:translate-x-0 xl:mr-[380px]'
            } transition-all w-full h-full grid grid-rows-[auto_1fr_auto] overflow-hidden`}
          >
            <comp.header />
            <comp.monitor
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              chats={chats}
              setChats={setChats}
              control={control}
              setControl={setControl}
              loaded={loaded}
            />
            <comp.send
              setChats={setChats}
              setNewMessage={setNewMessage}
              control={control}
            />
          </div>
          <GroupProfile />
          <FriendProfile />
          <GroupParticipant />
          <AddParticipant />
        </>
      )}
      {!chatRoom.data && (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-[400px] flex flex-col items-center">
            <i className="opacity-40">
              <md.MdDevices size={140} />
            </i>
            <p className="mt-4 opacity-60 text-center">
              {'You can use '}
              {config.brandName}
              {' on other devices such as desktop, tablet, and mobile phone.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Room;
