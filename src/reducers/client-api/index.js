import { notification } from 'antd'

const CONNECT = 'client-api-connect';
const CONNECTED = 'client-api-connected';
const CLOSED = 'client-api-closed';
const CALL = 'client-api-call';

const FETCH_JSON = 'client-api-fetch-json';

let api = {};

export const connect = (url, retry) => {
  return { type: CONNECT, url: url, retry: retry };
};

export const call = (event, data) => {
  let req = { event: event, data: data };
  return { type: CALL, payload: JSON.stringify(req) };
};

export const get = (event, url) => {
  return { type: FETCH_JSON, method: 'GET', event: event, url: url }
}

export const post = (event, url, obj) => {
  return { type: FETCH_JSON, method: 'POST', event: event, url: url, body: JSON.stringify(obj) }
}

export const put = (event, url, obj) => {
  return { type: FETCH_JSON, method: 'PUT', event: event, url: url, body: JSON.stringify(obj) }
}

export const del = (event, url) => {
  return { type: FETCH_JSON, method: 'DELETE', event: event, url: url }
}

export const notificationMiddleware = store => next => action => {
  if (action.type.endsWith('-response') && action.data.notify) {
    let notify = action.data.notify;
    notification[notify.type]({ message: notify.title, description: notify.msg });
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

    case FETCH_JSON:
      let options = { method: action.method, credentials: 'same-origin' };
      if (action.method === 'POST' || action.method === 'PUT') {
        options.body = action.body;
      }

      fetch(action.url, options)
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json()
          } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
          }
        })
        .then((data) => { next({ type: action.event, data: data }) })
        .catch((error) => { console.log('Fetch request failed: ', error); });
      break;

    default:
      break;

  }

  return next(action);
};