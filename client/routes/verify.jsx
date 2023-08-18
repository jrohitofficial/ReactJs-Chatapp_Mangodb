import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import { setMaster } from '../redux/features/user';
import config from '../config';

function Verify() {
  const dispatch = useDispatch();
  const master = useSelector((state) => state.user.master);

  const [respond, setRespond] = useState({ success: true });
  const [otp, setOtp] = useState({
    0: '',
    1: '',
    2: '',
    3: '',
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const { data } = await axios.post('/users/verify', {
        userId: master._id,
        otp: Number(Object.values(otp).join('')),
      });

      setOtp({
        0: '',
        1: '',
        2: '',
        3: '',
      });

      setRespond({ success: true });
      dispatch(setMaster(data.payload));

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error0) {
      setRespond({ success: false });
    }
  };

  return (
    <div className="absolute w-full h-full flex justify-center overflow-auto bg-white sm:bg-spill-100">
      <div className="p-6 w-[460px] h-full sm:h-auto">
        <h1 className="font-bold text-2xl font-display sm:text-center">
          {config.brandName}
        </h1>
        {/* body */}
        <div className="my-6 sm:p-6 rounded-md bg-white">
          <div>
            <h1 className="text-2xl font-bold">OTP Verification</h1>
            <p className="mt-1">
              <span>Please Enter The OTP Verification Code Sent To </span>
              <span className="font-bold">{master.email}</span>
            </p>
          </div>
          {/* form */}
          <form method="post" className="grid" onSubmit={handleSubmit}>
            <div className="mt-4 flex gap-4 justify-center">
              {[...Object.keys(otp)].map((elem, i) => (
                <input
                  type="text"
                  key={elem}
                  name={elem}
                  className={`${
                    respond.success ? 'border-black' : 'border-rose-600'
                  } w-full p-2 font-bold text-2xl text-center border-0 border-b border-solid`}
                  maxLength="1"
                  required
                  value={otp[i]}
                  onKeyDown={(e) => {
                    const del = e.key === 'Backspace' || e.key === 'Delete';
                    const previous = e.target.previousSibling;

                    // numbers only
                    if (!'0123456789'.includes(e.key)) {
                      // ignore the next event
                      e.preventDefault();
                    }

                    // if the backspace and delete keys are clicked
                    if (del) {
                      setOtp((prev) => ({ ...prev, [elem]: '' }));
                      if (previous) previous.focus();

                      // ignore the next event
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setRespond({ success: true });
                    setOtp((prev) => ({ ...prev, [elem]: e.target.value }));

                    const next = e.target.nextSibling;
                    if (next) next.focus();
                  }}
                />
              ))}
            </div>
            <button
              type="submit"
              className="mt-6 mb-2 p-2 font-bold rounded-md text-white bg-sky-600 hover:bg-sky-700"
            >
              Verify
            </button>
            <button
              type="button"
              className="p-2 font-bold rounded-md bg-spill-100 hover:bg-spill-200"
            >
              Re-Send OTP
            </button>
          </form>
        </div>
        <div className="pb-6 flex sm:justify-center">
          <button
            type="button"
            className="font-bold flex gap-2 items-center hover:underline"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}
          >
            <i>
              <bi.BiArrowBack size={18} />
            </i>
            <p>Back</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Verify;
