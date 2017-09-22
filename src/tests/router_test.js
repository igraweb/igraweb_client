/*jshint esversion: 6 */

import assert from 'assert';

import config from '../config';
import testHelper from './test_helper';
import router from '../router';

const { testRunner } = testHelper;

var tests = {
  test_redirect() {
    var calls = [];
    var path = '/oh/a/path';
    var originalNavigator = router.navigator;

    router.navigator = Object.assign({}, originalNavigator, {
      replace(href) {
        calls.push(href);
      }
    });

    router.redirect(path);

    assert.deepEqual(calls, [config.mount + path], 'router should redirect to the configured path');

    router.navigator = originalNavigator;
  },

  test_redirect_outside_mount() {
    const oldMount = config.mount;
    const testMount = '/blah-blah-testing-mount';
    const path = '/te/st/in/g';
    var calls = [];
    var originalNavigator = router.navigator;

    config.mount = testMount;

    router.navigator = Object.assign({}, originalNavigator, {
      replace(href) {
        calls.push(href);
      }
    });

    router.redirect(path, { mount: false });

    assert.deepEqual(calls, [path], 'router should redirect to path without mount');

    config.mount = oldMount;
    router.navigator = originalNavigator;
  },

  test_not_found_route() {
    var calls = [];
    var path = '/unexpected/path';
    var originalNavigator = router.navigator;
    var originalPath = router.paths.notFound;

    router.paths.notFound = path;

    router.navigator = {
      replace(href) {
        calls.push(href);
      }
    };

    router.notFound();

    assert.deepEqual(calls, [path], 'router should redirect to the configured path');

    router.paths.notFound = originalPath;
    router.navigator = originalNavigator;
  },

  test_unauthorized_route() {
    var modalNode;

    modalNode = document.getElementById('igraweb-modal');

    assert(!modalNode);

    router.unauthorized();

    modalNode = document.getElementById('igraweb-modal');

    assert(modalNode);
    assert(modalNode.innerText.includes('Login'));
    assert(modalNode.querySelector('input[name="access_key"]'));
    assert(modalNode.querySelector('input[name="secret_key"]'));
    assert(modalNode.innerText.includes('LOGIN'));

    modalNode.parentNode.removeChild(modalNode);
  },

  test_user_is_logged_in_when_login_button_is_clicked() {
  },

  test_is_at() {
    var path = window.location.pathname;

    router.paths.myTestPath = path;

    assert(router.isAt(path));
    assert(router.isAt('myTestPath'));
    assert(!router.isAt('myUnexpectedPath'));
    assert(!router.isAt('/my/Unexpected/Path'));

    delete router.paths.myTestPath;
  },
};

testRunner.run(tests);
