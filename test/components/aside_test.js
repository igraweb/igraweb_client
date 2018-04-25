/*jshint esversion: 6 */

require('jsdom-global')();

const {expect} = require('chai');

const Aside = require('../../dist/components/aside').default;
const Utils = require('../../dist/utils').default;

const { trigger } = Utils;

function insertAdjacentElement(where, el) {
  this.insertAdjacentHTML(where, el.outerHTML);
}

function createDiv() {
  const div = document.createElement('div');
  div.insertAdjacentElement = insertAdjacentElement.bind(div);
  return div;
}

describe('Aside', () => {
  it('respects the interface', () => {
    const aside = new Aside();

    expect(aside.build).to.be.a('function');
    expect(aside.action).to.be.a('function');
  });

  it('inserts aside in element', () => {
    const node = createDiv();
    const aside = new Aside();

    aside.build(node);

    expect(node.querySelector('aside')).to.be.ok;
  });

  it('adds a title', () => {
    const node = createDiv();
    const aside = new Aside();

    aside.title = "<h2>New Aside</h2>";

    aside.build(node);

    expect(node.innerHTML).to.include(aside.title);
  });

  it('adds a body', () => {
    const node = createDiv();
    const aside = new Aside();

    aside.body = "Some body";

    aside.build(node);

    expect(node.innerHTML).to.include(aside.body);
  });

  it('adds the actions', () => {
    const node = createDiv();
    const aside = new Aside();

    let button;

    aside.action('CLICK ME', function noOp() {});

    aside.build(node);

    button = node.querySelector('button');

    expect(button).to.be.ok;
    expect(button.innerHTML).to.include('CLICK ME');
  });

  it('adds action callbacks', () => {
    const node = createDiv();
    const aside = new Aside();

    const args = [];
    let called = false;

    aside.action('CLICK ME', function updateCalled(aside) {
      called = true;
      args.push(aside);
    });

    aside.build(node);

    trigger(node.querySelector('button'), 'click');

    expect(called).to.be.ok;
    expect(args).to.deep.equal([aside]);
  });
});
