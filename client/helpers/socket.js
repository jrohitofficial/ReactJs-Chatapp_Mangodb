import { io } from 'socket.io-client';

const isDev = process.env.NODE_ENV === 'development';

const socket = io(isDev ? 'ws://localhost:8080' : '/');
export default socket;
