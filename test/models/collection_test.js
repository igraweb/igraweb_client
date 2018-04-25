/*jshint esversion: 6 */

const {expect} = require('chai');

const Collection = require('../../dist/models/collection').default;

const theCollection = 'the collection';
let call;

const RepoMock = function() {
  this.calls = [];

  this.paginate = function(url) {
    this.calls.push(url);

    return new Promise(function(resolve) {
      resolve(theCollection);
    });
  };
};

describe('Collection', () => {
  it('respects the interface', () => {
    const collection = Collection({}, [], new RepoMock());

    expect(collection.forEach).to.be.a('function');
    expect(collection.nextPage).to.be.a('function');
    expect(collection.prevPage).to.be.a('function');
  });

  it('knows if there is a next page', () => {
    const repo = new RepoMock();
    const withoutLink = Collection({}, [], repo);
    const withLink = Collection({ next: 'http://next.com' }, [], repo);

    expect(withoutLink.hasNextPage).to.be.false;
    expect(withLink.hasNextPage).to.be.true;
  });

  it('knows if there is a previous page', () => {
    const repo = new RepoMock();
    const withoutLink = Collection({}, [], repo);
    const withLink = Collection({ prev: 'http://prev.com' }, [], repo);

    expect(withoutLink.hasPrevPage).to.be.false;
    expect(withLink.hasPrevPage).to.be.true;
  });

  it('resolves the next page', (done) => {
    const repo = new RepoMock();
    const url = 'http://next.com';
    const collection = Collection({ next: url }, [], repo);

    collection
      .nextPage()
      .then(function resolveWith(newCollection) {
        expect(newCollection).to.equal(theCollection, 'nextPage should resolve with the collection');
        expect(repo.calls[0]).to.equal(url, `the repo should be sent the pagination message with the url: ${repo.calls[0]} === ${url}`);
        done();
      }, function rejectWith() {
        expect(false).to.be.ok('The promise should resolve');
        done();
      })
      .catch(function(error) {
        expect(false).to.be.ok(error.message || error);
        done();
      });
  });

  it('resolves the previous page', (done) => {
    const repo = new RepoMock();
    const url = 'http://prev.com';
    const collection = Collection({ prev: url }, [], repo);

    collection
      .prevPage()
      .then(function resolveWith(newCollection) {
        expect(newCollection).to.equal(theCollection, 'nextPage should resolve with the collection');
        expect(repo.calls[0]).to.equal(url, `the repo should be sent the pagination message with the url: ${repo.calls[0]} === ${url}`);
        done();
      }, function rejectWith() {
        expect(false).to.be.ok('The promise should resolve');
        done();
      })
      .catch(function(error) {
        expect(false).to.be.ok(error.message || error);
        done();
      });
  });
});
