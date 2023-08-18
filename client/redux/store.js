import { configureStore } from '@reduxjs/toolkit';
import * as reducer from './features';

const store = configureStore({ reducer });
export default store;
