/*jshint esversion: 6 */

import assert from 'assert';

import navigator from '../../utils/navigator';
import testHelper from '../test_helper';

const { testRunner } = testHelper;

var tests = {
  test_interface() {
    assert(typeof navigator.reload === 'function', 'reload should be a function');
    assert(typeof navigator.replace === 'function', 'replace should be a function');
    assert(typeof navigator.href === 'function', 'href should be a function');
    assert(typeof navigator.path === 'function', 'path should be a function');
  },
};

testRunner.run(tests);
