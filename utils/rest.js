/*jshint esversion: 6 */

import config from '../config';
import currentUser from './current_user';

var rest = function(url, options = {}) {
  var { headers = new Headers() } = options;
  var user = currentUser();
  var fullUrl = options.fullUrl;

  delete options.fullUrl;

  if (!fullUrl) {
    url = config.api + url;
  }

  url += url.includes('?') ? '&' : '?';
  url += `api_site_key=${config.api_site_key}`;

  if (user) {
    var { authentication: { token } } = currentUser();

    if (token) {
      headers.append('Authorization', `Token ${token}`);
    }
  }

  options.headers = headers;

  return fetch(url, options);
};

export default rest;
