/*jshint esversion: 6 */

require('jsdom-global')();

const {expect} = require('chai');

const config = require('../dist/config').default;
const router = require('../dist/router').default;

describe('router', () => {
  describe('redirect', () => {
    const path = '/oh/a/path';
    let calls;
    let originalNavigator;

    before(() => {
      calls = [];
      originalNavigator = router.navigator;

      router.navigator = Object.assign({}, originalNavigator, {
        replace(href) {
          calls.push(href);
        }
      });
    });

    after(() => {
      router.navigator = originalNavigator;
    });

    it('redirects to a path', () => {
      router.redirect(path);

      expect(calls).to.deep.equal(
        [config.mount + path],
        'router should redirect to the configured path'
      );
    });
  });

  describe('redirect with mount: false', () => {
    const path = '/te/st/in/g';
    let calls;
    let oldMount;
    let testMount;
    let originalNavigator;

    before(() => {
      calls = [];
      oldMount = config.mount;
      testMount = '/blah-blah-testing-mount';
      originalNavigator = router.navigator;

      config.mount = testMount;

      router.navigator = Object.assign({}, originalNavigator, {
        replace(href) {
          calls.push(href);
        }
      });
    });

    after(() => {
      config.mount = oldMount;
      router.navigator = originalNavigator;
    });

    it('redirects to a path outside of mount', () => {
      router.redirect(path, { mount: false });

      expect(calls).to.deep.equal(
        [path],
        'router should redirect to path without mount'
      );
    });
  });

  describe('paths', () => {
    const path = '/unexpected/path';
    let originalNavigator;
    let originalPath;
    let calls;

    before(() => {
      calls = [];
      originalNavigator = router.navigator;
      originalPath = router.paths.notFound;

      router.paths.notFound = path;

      router.navigator = {
        replace(href) {
          calls.push(href);
        }
      };
    });

    after(() => {
      router.paths.notFound = originalPath;
      router.navigator = originalNavigator;
    });

    it('redirects to the named path', () => {
      router.notFound();

      expect(calls).to.deep.equal(
        [path],
        'router should redirect to the configured path'
      );
    });
  });

  describe('unauthorized', () => {
    after(() => {
      const modalNode = document.getElementById('igraweb-modal');

      if (modalNode) {
        modalNode.parentNode.removeChild(modalNode);
      }
    });

    it('opens the login modal', () => {
      let modalNode;

      modalNode = document.getElementById('igraweb-modal');

      expect(modalNode).to.be.null;

      router.unauthorized();

      modalNode = document.getElementById('igraweb-modal');

      expect(modalNode).not.to.be.null;
      expect(modalNode.innerHTML).to.include('Login');
      expect(modalNode.innerHTML).to.include('LOGIN');
      expect(modalNode.querySelector('input[name="access_key"]')).not.to.be.null;
      expect(modalNode.querySelector('input[name="secret_key"]')).not.to.be.null;
    });
  });

  describe('isAt', () => {
    const path = window.location.pathname;

    before(() => {
      router.paths.myTestPath = path;
    });

    after(() => {
      delete router.paths.myTestPath;
    });

    it('can tell if the browser is at a path', () => {
      expect(router.isAt(path)).to.be.ok;
      expect(router.isAt('myTestPath')).to.be.ok;
      expect(!router.isAt('myUnexpectedPath')).to.be.ok;
      expect(!router.isAt('/my/Unexpected/Path')).to.be.ok;
    });
  });
});
