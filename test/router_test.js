/*jshint esversion: 6 */

require('jsdom-global')();

const assert = require('assert');

const config = require('../dist/config').default;
const router = require('../dist/router').default;

describe('router', () => {
  it('redirects to a path', () => {
    const calls = [];
    const path = '/oh/a/path';
    const originalNavigator = router.navigator;

    router.navigator = Object.assign({}, originalNavigator, {
      replace(href) {
        calls.push(href);
      }
    });

    router.redirect(path);
    router.navigator = originalNavigator;

    assert.deepEqual(calls, [config.mount + path], 'router should redirect to the configured path');
  });

  it('redirects to a path outside of mount', () => {
    const oldMount = config.mount;
    const testMount = '/blah-blah-testing-mount';
    const path = '/te/st/in/g';
    const calls = [];
    const originalNavigator = router.navigator;

    config.mount = testMount;

    router.navigator = Object.assign({}, originalNavigator, {
      replace(href) {
        calls.push(href);
      }
    });

    router.redirect(path, { mount: false });
    config.mount = oldMount;
    router.navigator = originalNavigator;

    assert.deepEqual(calls, [path], 'router should redirect to path without mount');
  });

  it('redirects to the named path', () => {
    const calls = [];
    const path = '/unexpected/path';
    const originalNavigator = router.navigator;
    const originalPath = router.paths.notFound;

    router.paths.notFound = path;

    router.navigator = {
      replace(href) {
        calls.push(href);
      }
    };

    router.notFound();
    router.paths.notFound = originalPath;
    router.navigator = originalNavigator;

    assert.deepEqual(calls, [path], 'router should redirect to the configured path');
  });

  it('sanity', () => {
    document.body.insertAdjacentHTML('beforeend', '<div id="test"></div>');
    document.getElementById('test').innerHTML = '<p></p>';
    assert(document.getElementById('test').innerHTML.includes('p'));
  });

  it('unauthorized route', () => {
    let modalNode;

    modalNode = document.getElementById('igraweb-modal');

    assert(!modalNode);

    router.unauthorized();

    modalNode = document.getElementById('igraweb-modal');

    assert(modalNode);
    assert(modalNode.innerHTML.includes('Login'));
    assert(modalNode.querySelector('input[name="access_key"]'));
    assert(modalNode.querySelector('input[name="secret_key"]'));
    assert(modalNode.innerHTML.includes('LOGIN'));

    modalNode.parentNode.removeChild(modalNode);
  });

  /**
   * describe('user_is_logged_in_when_login_button_is_clicked', () => {
   * }),
   */

  it('can tell if the browser is at a path', () => {
    const path = window.location.pathname;

    router.paths.myTestPath = path;

    assert(router.isAt(path));
    assert(router.isAt('myTestPath'));
    assert(!router.isAt('myUnexpectedPath'));
    assert(!router.isAt('/my/Unexpected/Path'));

    delete router.paths.myTestPath;
  });
});
