/*jshint esversion: 6 */

// TODO: Maybe "router" and "navigator" can be combined

var navigator = {
  reload() {
    window.location.reload();
  },

  replace(href) {
    window.location.href = href;
  },

  href() {
    return window.location.href;
  },

  path() {
    return window.location.pathname;
  },
};

export default navigator;
