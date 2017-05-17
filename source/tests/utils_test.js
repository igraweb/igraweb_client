/*jshint esversion: 6 */

import assert from 'assert';

import testHelper from './test_helper';
import Utils from '../utils';

const { testRunner } = testHelper;

var tests = {
  test_flatten_query_object_with_two_levels() {
    var obj = { page: { size: 1 } };
    var expected = { 'page[size]': 1 };

    assert.deepEqual(expected, Utils.flattenQueryObject(obj));
  },

  test_flatten_query_object_with_many_levels() {
    var obj = { page: { size: { factor: { gradient: 1 } } } };
    var expected = { 'page[size][factor][gradient]': 1 };

    assert.deepEqual(expected, Utils.flattenQueryObject(obj));
  },

  test_flatten_query_object_with_many_levels_and_sizes() {
    var obj = {
      page: {
        size: {
          factor: { gradient: 1, other: 2 },
          other: 2
        }
      }
    };
    var expected = {
      'page[size][factor][gradient]': 1,
      'page[size][factor][other]': 2,
      'page[size][other]': 2,
    };

    assert.deepEqual(expected, Utils.flattenQueryObject(obj));
  },
};

testRunner.run(tests);

