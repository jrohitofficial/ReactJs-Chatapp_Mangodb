import React from 'react';
import { Helmet } from 'react-helmet';
import config from '../config';

function Inactive() {
  return (
    <div className="absolute w-full h-full flex justify-center items-center bg-spill-100 dark:text-white dark:bg-spill 900">
      <Helmet>
        <title>{`${config.brandName} [inactive]`}</title>
        <link
          rel="shortcut icon"
          href="assets/images/error.ico"
          type="image/x-icon"
        />
      </Helmet>
      <div className="m-6 p-4 w-[460px] rounded-md bg-white dark:bg-spill-800">
        <h1 className="text-2xl font-bold">Error!</h1>
        <p className="mt-1">
          {config.brandName}
          {' is open in another window. Click "Use Here" to use '}
          {config.brandName}
          {' in this window.'}
        </p>
        <span className="mt-4 flex justify-end">
          <button
            type="button"
            className="font-bold py-2 px-4 rounded-md text-white bg-sky-600 hover:bg-sky-700"
            onClick={() => window.location.reload()}
          >
            <p>Use Here</p>
          </button>
        </span>
      </div>
    </div>
  );
}

export default Inactive;
