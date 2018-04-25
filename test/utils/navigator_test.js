/*jshint esversion: 6 */

require('jsdom-global')();

const {expect} = require('chai');

const navigator = require('../../dist/utils/navigator').default;

describe('navigator', () => {
  it('respects the interface', () => {
    expect(navigator.reload).to.be.a('function');
    expect(navigator.replace).to.be.a('function');
    expect(navigator.href).to.be.a('function');
    expect(navigator.path).to.be.a('function');
  });
});
