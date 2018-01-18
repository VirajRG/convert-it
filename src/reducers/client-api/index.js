import { show } from 'react-notification-system-redux';

const CONNECT = 'client-api-connect';
const CONNECTED = 'client-api-connected';
const CLOSED = 'client-api-closed';
const CALL = 'client-api-call';

let api = {};

export const connect = (url, retry) => {
  return { type: CONNECT, url: url, retry: retry };
};

export const call = (event, data) => {
  let req = { event: event, data: data };
  return { type: CALL, payload: JSON.stringify(req) };
};

export const notificationMiddleware = store => next => action => {
  if (action.type.endsWith('-response') && action.data.notify) {
    let notify = action.data.notify;
    var opts = { title: notify.title, message: notify.msg };
    next(show(opts, notify.type));
  }
  next(action);
};

export const clientApiMiddleware = store => next => action => {
  switch (action.type) {
    case CONNECT:
      let socket = new WebSocket(action.url);
      api.url = action.url;
      api.retry = action.retry;

      socket.onopen = function (e) {
        api.isConnected = true;
        api.socket = socket;
        next({ type: CONNECTED });
      };

      socket.onmessage = function (e) {
        let res = JSON.parse(e.data);
        next({ type: res.event + '-response', data: res.data });
      };

      socket.onclose = function (e) {
        if (api.retry) {
          setTimeout(() => store.dispatch({ type: CONNECT, url: api.url, retry: true }), 5000);
        }
        api.isConnected = false;
        next({ type: CLOSED });
      };
      break;

    case CALL:
      api.socket.send(action.payload);
      break;

    default:
      break;

  }

  return next(action);
};