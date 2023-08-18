import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import './style.css';
import * as route from './routes';
import { setMaster, setSetting } from './redux/features/user';
import socket from './helpers/socket';
import config from './config';
import { getSetting } from './api/services/setting.api';

function App() {
  const dispatch = useDispatch();
  const { master } = useSelector((state) => state.user);

  const [inactive, setInactive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // get access token from localStorage
  const token = localStorage.getItem('token');

  const handleGetMaster = async (signal) => {
    try {
      if (token) {
        // set default authorization
        axios.defaults.headers.Authorization = `Bearer ${token}`;
        // get account setting
        const setting = await getSetting({ signal });

        if (setting) {
          dispatch(setSetting(setting));

          const { data } = await axios.get('/users', { signal });
          // set master
          dispatch(setMaster(data.payload));
          socket.emit('user/connect', data.payload._id);
        }

        setLoaded(true);
      } else {
        setTimeout(() => setLoaded(true), 1000);
      }
    } catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    const abortCtrl = new AbortController();
    // set default base url
    axios.defaults.baseURL = config.isDev
      ? 'http://localhost:8080/api'
      : '/api';
    handleGetMaster(abortCtrl.signal);

    socket.on('user/inactivate', () => {
      setInactive(true);
      dispatch(setMaster(null));
    });

    return () => {
      abortCtrl.abort();
      socket.off('user/inactivate');
    };
  }, []);

  useEffect(() => {
    document.onvisibilitychange = (e) => {
      if (master) {
        const active = e.target.visibilityState === 'visible';
        socket.emit(active ? 'user/connect' : 'user/disconnect', master._id);
      }
    };
  }, [!!master]);

  return (
    <BrowserRouter>
      {loaded ? (
        <Routes>
          {inactive && <Route exact path="*" element={<route.inactive />} />}
          {!inactive && master ? (
            <Route
              exact
              path="*"
              element={master.verified ? <route.chat /> : <route.verify />}
            />
          ) : (
            <Route exact path="*" element={<route.auth />} />
          )}
        </Routes>
      ) : (
        <div className="absolute w-full h-full flex justify-center items-center bg-white dark:text-white/90 dark:bg-spill-900">
          <div className="flex gap-2 items-center">
            <i className="animate-spin">
              <bi.BiLoaderAlt />
            </i>
            <p>Loading</p>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
