/*jshint esversion: 6 */

// TODO: Maybe "router" and "navigator" can be combined

const location = window.location;

const navigator = {
  reload() {
    location.reload();
  },

  replace(href) {
    location.href = href;
  },

  href() {
    return location.href;
  },

  path() {
    return location.pathname;
  },

  hash() {
    return location.hash;
  }
};

export default navigator;
