/*jshint esversion: 6 */

import assert from 'assert';

import testHelper from '../test_helper';
import Aside from '../../components/aside';
import Utils from '../../utils';

const { testRunner } = testHelper;
const { trigger } = Utils;

var tests = {
  test_interface() {
    var aside = new Aside();

    assert.equal(typeof aside.build, 'function', 'build should be a function');
    assert.equal(typeof aside.action, 'function', 'action should be a function');
  },

  test_build_inserts_aside() {
    var node = document.createElement('div');
    var aside = new Aside();

    aside.build(node);

    assert(node.querySelector('aside'), 'there should be an aside tag');
  },

  test_build_includes_title() {
    var node = document.createElement('div');
    var aside = new Aside();

    aside.title = "<h2>New Aside</h2>";

    aside.build(node);

    assert(node.innerHTML.includes(aside.title), 'the title should be rendered');
  },

  test_build_includes_body() {
    var node = document.createElement('div');
    var aside = new Aside();

    aside.body = "Some body";

    aside.build(node);

    assert(node.innerHTML.includes(aside.body), 'the body should be rendered');
  },

  test_build_inserts_actions() {
    var node = document.createElement('div');
    var aside = new Aside();

    var button;

    aside.action('CLICK ME', function noOp() {});

    aside.build(node);

    button = node.querySelector('button');

    assert(button, 'there should be a button');
    assert(button.innerText.includes('CLICK ME'), `the button should have the right content: ${button.outerHTML}`);
  },

  test_build_adds_action_callbacks() {
    var node = document.createElement('div');
    var aside = new Aside();

    var called = false;
    var args = [];

    aside.action('CLICK ME', function updateCalled(aside) {
      called = true;
      args.push(aside);
    });

    aside.build(node);

    trigger(node.querySelector('button'), 'click');

    assert(called, 'the callback should be called');
    assert.deepEqual(args, [aside], 'aside should be passed to the callback');
  },
};

testRunner.run(tests);
