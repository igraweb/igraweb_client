/*jshint esversion: 6 */

import rest from './rest';

var currentUser = function() {
  if (currentUser.isAuthenticated()) {
    return { 
      authentication: currentUser.getAuthentication(),
    };
  }
};

Object.assign(currentUser, {
  isAuthenticated() {
    return !!currentUser.getAuthentication();
  },

  logout() {
    sessionStorage.removeItem(currentUser.storageKey);
  },

  getAuthentication() {
    var serialized = sessionStorage.getItem(currentUser.storageKey);
    return JSON.parse(serialized);
  },

  setAuthentication(data) {
    var serialized = JSON.stringify(data);
    sessionStorage.setItem(currentUser.storageKey, serialized);
  },

  storageKey: 'igraweb:current-user',

  authenticate(access_key, secret_key) {
    var body = new FormData();
    body.append('user[access_key]', access_key);
    body.append('user[secret_key]', secret_key);

    return rest('users/authenticate', { method: 'POST', body })
      .then(function(response) {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(`Request failed with status ${status}`);
        }
      })
      .then(function storeAuthentication(json) {
        return Promise.resolve(currentUser.setAuthentication(json));
      });
  },
});

export default currentUser;
