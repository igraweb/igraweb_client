/**
 * ONLY LOAD THIS ONCE
 *
 * These include initializations of polyfills required for the igraweb
 * client.
 */

(function () {
  if ( typeof NodeList.prototype.forEach === "function" ) return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
})();

// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
if (window.Element && !Element.prototype.closest) {
  Element.prototype.closest = 
    function(s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
    i,
    el = this;
  do {
    i = matches.length;
    while (--i >= 0 && matches.item(i) !== el) {};
  } while ((i < 0) && (el = el.parentElement)); 
    return el;
  };
}

import 'whatwg-fetch';
import babelPolyfill from 'babel-polyfill';
