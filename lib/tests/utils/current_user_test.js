/*jshint esversion: 6 */

import assert from 'assert';

import currentUser from '../../utils/current_user';
import testHelper from '../test_helper';

const { testRunner } = testHelper;

var tests = {
  test_interface() {
    assert(typeof currentUser.isAuthenticated === 'function', 'isAuthenticated should be a function'); 
    assert(typeof currentUser.logout === 'function', 'logout should be a function'); 
    assert(typeof currentUser.getAuthentication === 'function', 'getAuthentication should be a function'); 
    assert(typeof currentUser.setAuthentication === 'function', 'setAuthentication should be a function'); 
  },

  test_get_and_set_authentication() {
    var originalAuthentication = currentUser.getAuthentication();
    var authentication = 'authentication';

    currentUser.setAuthentication(authentication);

    assert.deepEqual(currentUser.getAuthentication(), authentication);

    currentUser.setAuthentication(originalAuthentication);
  },

  test_is_authenticated() {
    var originalAuthentication = currentUser.getAuthentication();
    var authentication = {
      email: 'admin@gravastar.cz',
      token: 'a7f5f43a21dd74162567f60f32ecac45',
    };

    currentUser.setAuthentication(authentication);

    assert(currentUser.isAuthenticated());

    currentUser.setAuthentication(originalAuthentication);
  },

  test_logout() {
    var originalAuthentication = currentUser.getAuthentication();
    var authentication = {
      email: 'admin@gravastar.cz',
      token: 'a7f5f43a21dd74162567f60f32ecac45',
    };

    currentUser.setAuthentication(authentication);

    assert(currentUser.isAuthenticated());

    currentUser.logout();

    assert(!currentUser.isAuthenticated());

    currentUser.setAuthentication(originalAuthentication);
  },
};

testRunner.run(tests);
