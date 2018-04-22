/*jshint esversion: 6 */

require('jsdom-global')();

const {expect} = require('chai');

const currentUser = require('../../dist/utils/current_user').default;

describe('currentUser', () => {
  it('respects the interface', () => {
    expect(currentUser.isAuthenticated).to.be.a('function'); 
    expect(currentUser.logout).to.be.a('function'); 
    expect(currentUser.getAuthentication).to.be.a('function'); 
    expect(currentUser.setAuthentication).to.be.a('function'); 
  });

  describe('get and set Authentication', () => {
    let originalAuthentication;

    before(() => {
      originalAuthentication = currentUser.getAuthentication();
    });

    after(() => {
      currentUser.setAuthentication(originalAuthentication);
    });

    it('works', () => {
      const authentication = 'authentication';
      currentUser.setAuthentication(authentication);

      expect(currentUser.getAuthentication()).to.equal(authentication);
    });

    it('is authenticated', () => {
      const authentication = {
        email: 'admin@gravastar.cz',
        token: 'a7f5f43a21dd74162567f60f32ecac45',
      };

      currentUser.setAuthentication(authentication);

      expect(currentUser.isAuthenticated()).to.be.ok;
    });

    it('logs the user out', () => {
      var authentication = {
        email: 'admin@gravastar.cz',
        token: 'a7f5f43a21dd74162567f60f32ecac45',
      };

      currentUser.setAuthentication(authentication);

      expect(currentUser.isAuthenticated());

      currentUser.logout();

      expect(currentUser.isAuthenticated()).not.to.be.ok;
    });
  });
});
