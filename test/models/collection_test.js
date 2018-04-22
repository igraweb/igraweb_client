/*jshint esversion: 6 */

import assert from 'assert';

import testHelper from '../test_helper';
import Collection from '../../models/collection';

const { testRunner, testPromise } = testHelper;

var theCollection = 'the collection';
var call;

var RepoMock = function() {
  this.calls = [];

  this.paginate = function(url) {
    this.calls.push(url);

    return new Promise(function(resolve) {
      resolve(theCollection);
    });
  };
};

var tests = {
  test_constructor() {
    var collection = Collection({}, [], new RepoMock());

    assert(collection, 'Collection() should create a collection object');
    assert.deepEqual(collection.constructor, Collection, 'Collection() should create a collection object');
  },

  test_interface() {
    var collection = Collection({}, [], new RepoMock());

    assert.equal(typeof(collection.forEach), 'function', 'forEach should be a function');
    assert.equal(typeof(collection.nextPage), 'function', 'nextPage should be a function');
    assert.equal(typeof(collection.prevPage), 'function', 'prevPage should be a function');
  },

  test_has_next_link() {
    var repo = new RepoMock();
    var withoutLink = Collection({}, [], repo);
    var withLink = Collection({ next: 'http://next.com' }, [], repo);

    assert(!withoutLink.hasNextPage);
    assert(withLink.hasNextPage, 'hasNextPage should be true');
  },

  test_has_prev_link() {
    var repo = new RepoMock();
    var withoutLink = Collection({}, [], repo);
    var withLink = Collection({ prev: 'http://prev.com' }, [], repo);

    assert(!withoutLink.hasPrevPage);
    assert(withLink.hasPrevPage, 'hasPrevPage should be true');
  },

  test_next_page() {
    var repo = new RepoMock();
    var url = 'http://next.com';
    var collection = Collection({ next: url }, [], repo);

    var promise = collection
      .nextPage()
      .then(function resolveWith(newCollection) {
        assert.equal(newCollection, theCollection, 'nextPage should resolve with the collection');
        assert.equal(repo.calls[0], url, 'the repo should be sent the pagination message with the url');
      }, function rejectWith() {
        assert(false, 'The promise should resolve');
      })
      .catch(function(error) {
        assert(false, error.message || error);
      });

    this.testPromises = [promise];
  },

  test_prev_page() {
    var repo = new RepoMock();
    var url = 'http://prev.com';
    var collection = Collection({ prev: url }, [], repo);

    var promise = collection
      .prevPage()
      .then(function resolveWith(newCollection) {
        assert.equal(newCollection, theCollection, 'nextPage should resolve with the collection');
        assert.equal(repo.calls[0], url, `the repo should be sent the pagination message with the url: ${repo.calls[0]} === ${url}`);
      }, function rejectWith() {
        assert(false, 'The promise should resolve');
      })
      .catch(function(error) {
        assert(false, error.message || error);
      });

    this.testPromises = [promise];
  },
};

testRunner.run(tests);
