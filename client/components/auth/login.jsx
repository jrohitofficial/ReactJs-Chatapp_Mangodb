import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import config from '../../config';

function Login({ setRespond }) {
  const cache = JSON.parse(localStorage.getItem('cache'));

  const [process, setProcess] = useState(false);
  const [form, setForm] = useState({
    me: false,
    username: cache?.me || '',
    password: '',
  });

  const handleChange = (e) => {
    // if it's a checkbox, get target.checked
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setProcess(true);
      const { data } = await axios.post('/users/login', form);

      // store jwt token on localStorage
      localStorage.setItem('token', data.payload);
      localStorage.setItem(
        'cache',
        JSON.stringify({
          me: form.me ? form.username : null,
        })
      );

      // reset form
      setForm((prev) => ({ ...prev, username: '', password: '' }));
      setRespond({ success: true, message: data.message });

      // reload this page after 1s
      setTimeout(() => {
        setProcess(false);
        window.location.reload();
      }, 1000);
    } catch (error0) {
      setProcess(false);
      setRespond({
        success: false,
        message: error0.response.data.message,
      });
    }
  };

  return (
    <form method="post" className="grid gap-2" onSubmit={handleSubmit}>
      <Helmet>
        <title>{`Sign in - ${config.brandName}`}</title>
      </Helmet>
      {[
        {
          target: 'username',
          type: 'text',
          placeholder: 'Username or Email',
          icon: <bi.BiUser size={20} />,
          minLength: 3,
        },
        {
          target: 'password',
          type: 'password',
          placeholder: 'Password',
          icon: <bi.BiLockOpenAlt size={20} />,
          minLength: 6,
        },
      ].map((elem) => (
        <label
          key={elem.target}
          htmlFor="username"
          className="relative flex items-center"
        >
          <i className="absolute translate-x-4">{elem.icon}</i>
          <input
            type={elem.type}
            name={elem.target}
            id={elem.target}
            placeholder={elem.placeholder}
            minLength={elem.minLength}
            className={`${
              form[elem.target].length > 0 ? 'peer valid:bg-gray-50' : ''
            } w-full py-2 pl-12 pr-3 border border-solid border-gray-300 rounded-md focus:border-gray-900`}
            value={form[elem.target]}
            onChange={handleChange}
            required
          />
          <bi.BiCheck className="absolute right-0 text-xl text-emerald-600 hidden peer-valid:block -translate-x-4" />
          <bi.BiX className="absolute right-0 text-xl text-red-600 hidden peer-invalid:block -translate-x-4" />
        </label>
      ))}
      <span className="flex">
        <label htmlFor="me" className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="me"
            id="me"
            onChange={handleChange}
            defaultChecked={!!cache?.me}
          />
          <p>Remember Me</p>
        </label>
      </span>
      {/* submit btn */}
      <button
        type="submit"
        className="font-bold mt-6 py-2 flex justify-center rounded-md text-white bg-sky-600 hover:bg-sky-700"
        disabled={process}
      >
        {process ? (
          <i className="animate-spin">
            <bi.BiLoaderAlt />
          </i>
        ) : (
          <p>Sign In</p>
        )}
      </button>
    </form>
  );
}

export default Login;
