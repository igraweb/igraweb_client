/*jshint esversion: 6 */

import config from './config';

import navigator from './utils/navigator';

const LoginModal = config.components.LoginModal;

/**
 * TODO: Maybe "router" and "navigator" can be combined
 *
 * router is responsible for opening replacing the page context, either by
 * changing the window location or by opening a modal. Router is also used
 * to query if the current context is at a named route. (See
 * `config.routes`.)
 */
var router = {
  /**
   * @property paths
   * @private
   */
  paths: config.routes,

  /**
   * @property navigator
   * @private
   */
  navigator,

  /**
   * Reload the page.
   *
   * @method reload
   * @public
   */
  reload() {
    this.navigator.reload();
  },

  /**
   * Redirect to the notFound path.
   *
   * @method notFound
   * @public
   */
  notFound() {
    this.navigator.replace(this.paths.notFound);
  },

  /**
   * Load the login modal.
   *
   * @method unauthorized
   * @public
   */
  unauthorized() {
    var loginModal = LoginModal();

    loginModal.init();
  },

  /**
   * Change the page context (`window.location`) to a named path or a
   * specified path.
   *
   * @method redirect
   * @public
   */
  redirect(pathOrPathName, options = {}) {
    const { mount = true } = options;
    let path = this.path(pathOrPathName);

    if (mount) { path = config.mount + path; }

    this.navigator.replace(path);
  },

  /**
   * Check if the current page context (`window.location`) is at a named
   * path or a specified path.
   *
   * @method path
   * @private
   */
  isAt(pathOrPathName) {
    var path = this.path(pathOrPathName);

    return this.navigator.path() === path;
  },

  /**
   * @method path
   * @private
   */
  path(pathOrPathName) {
    return this.paths[pathOrPathName] || pathOrPathName;
  },
};

export default router; 
