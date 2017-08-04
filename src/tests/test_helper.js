/*jshint esversion: 6 */

import config from '../config';

/**
 * The test helper class is responsible for running tests. You can register
 * groups of tests to be run by using the testRunner.run() function. Test
 * groups are just objects with functions that will be run as tests.
 *
 * @example
 *   var tests = {
 *     test_true() {
 *       assert(true);
 *     },
 *   };
 *
 *   testRunner.run(tests);
 *
 * All tests should be run once the page loads.
 * 
 * Tests that include promises can make sure that the test results are
 * reported correctly by:
 *
 * 1) Returning a single promise from the test, or
 * 2) Setting `this.testPromises` in the test body as an array of promises
 *    to be tested.
 *
 * @example
 *   var tests = {
 *     test_promise() {
 *       var promise = Promise.resolve('value');
 *
 *       // Either
 *       return promise;
 *
 *       // OR
 *       this.testPromises = [promise];
 *     },
 *   };
 *
 * @class testRunner
 * @public
 */

var { runTests } = config;

var Test = function(fn) {
  var _this = this;

  this.skip = function() {
    this.skipped = true;

    throw new Error('skip this test');
  };

  this.run = function() {
    var testReturn;
    var success = function() {
      _this.success = true;
    };
    var failure = function() {
      _this.success = false;
    };
    var threw = function(error) {
      console.error(error);
      _this.success = false;
    };

    if (_this.skipped) {
      return Promise.resolve();
    }

    try {
      testReturn = fn.call(_this);
    } catch(error) {
      if (!_this.skipped) {
        threw(error);
        return Promise.resolve();
      }
    }

    if (testReturn && testReturn.constructor === Promise) {
      return Promise.all([testReturn]).then(success).catch(threw);
    } else if (_this.testPromises) {
      return Promise.all(_this.testPromises).then(success).catch(threw);
    } else {
      success();
    }

    return Promise.resolve();
  };
};

var testRunner = {
  testGroups: [],

  run(tests) {
    this.testGroups.push(tests);
  },

  load() {
    var _this = this;
    var startTime = new Date();
    var endTime;
    var totalTime;
    var testCount = 0;
    var failCount = 0;
    var skipCount = 0;

    if (!runTests) {
      return;
    }

    var testResults = [];
    _this.testGroups.forEach(function runTestGroup(tests) {
      var promises = Object.keys(tests).map(function(name) {
        var fn = tests[name];
        var test = new Test(fn);

        if (name[0] === 'x') {
          test.skipped = true;
        }

        return test
          .run()
          .then(function scoreResult() {
            testCount += 1;
            if (test.skipped) {
              skipCount += 1;
            } else if (!test.success) {
              failCount += 1;
            }
          });
      });
      testResults = testResults.concat(promises);
    });

    Promise
      .all(testResults)
      .then(function() {
        endTime = new Date();

        totalTime = endTime - startTime;

        console.info(`All tests run in: ${totalTime}ms. (${failCount}/${testCount}) failures, ${skipCount} skipped`);
      });
  },
};

export default {
  runTests,
  testRunner,
};
