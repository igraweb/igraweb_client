/*jshint esversion: 6 */

import config from '../config';

var form = {
  showErrors() {
    var errors = this.errors;
    var node = this.form;

    this.clearErrors();

    if (!node || !errors || errors.isEmpty()) {
      return;
    }

    errors.forEach(function(error) {
      var { input, message } = error;
      var errorHTML;

      if (!input) {
        return;
      }

      errorHTML = `<div class="igraweb-form-error">${message}</div>`;

      input.classList.add('igraweb-has-error');
      input.insertAdjacentHTML('afterend', errorHTML);
    });
  },

  clearErrors() {
    var node = this.form;

    if (!node) {
      return;
    }

    node
      .querySelectorAll('.igraweb-form-error')
      .forEach(function removeErrorNode(node) {
        node.parentNode.removeChild(node);
      });

    node
      .querySelectorAll('.igraweb-has-error')
      .forEach(function removeErrorClass(node) {
        node.classList.remove('igraweb-has-error');
      });
  }
};

export default form;
