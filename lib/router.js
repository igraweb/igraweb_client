/*jshint esversion: 6 */

// TODO: Maybe "router" and "navigator" can be combined

import config from './config';

import navigator from './utils/navigator';

const LoginModal = config.components.LoginModal;

var router = {
  paths: config.routes,

  navigator,

  reload() {
    this.navigator.reload();
  },

  notFound() {
    this.navigator.replace(this.paths.notFound);
  },

  unauthorized() {
    var loginModal = LoginModal();

    loginModal.init();
  },

  redirect(pathOrPathName) {
    var path = this.path(pathOrPathName);

    this.navigator.replace(path);
  },

  isAt(pathOrPathName) {
    var path = this.path(pathOrPathName);

    return this.navigator.path() === path;
  },

  /**
   * @private
   * @method
   */
  path(pathOrPathName) {
    return this.paths[pathOrPathName] || pathOrPathName;
  },

};

export default router; 
