/*jshint esversion: 6 */

/**
 * Helper for building modals
 *
 * @class
 * @public
 */
const Modal = function() {
  this.node = document.getElementById('igraweb-modal');

  if (!this.node) {
    document.body.insertAdjacentHTML('beforeend', '<div id="igraweb-modal"></div>');
    this.node = document.getElementById('igraweb-modal');
  }

  Object.assign(this, {
    size: 'md',

    action(name, fn) {
      this.actions = this.actions || {};

      this.actions[name] = fn;
    },

    build() {
      this.node.innerHTML = `
        <div class="igraweb-modal-container">
          <div class="igraweb-modal igraweb-modal-${this.size}">
            <div class="modal-title">
              <a id="igraweb-modal-close" class="igraweb-icon modal-close-button">&#249;</a>
              ${this.title}
            </div>
            <div class="modal-body">${this.body}</div>
            <div class="model-actions">${this.buildActions()}</div>
          </div>
        </div>
      `;
      this.bindActions();
      this.bindClose();
    },

    actionId(name) {
      return `igraweb-modal-action-${name}`;
    },

    actionNode(name) {
      var selector = `#igraweb-modal-action-${name}`;

      return this.node.querySelector(selector);
    },

    bindClose() {
      var _this = this;
      var closeButtonId = 'igraweb-modal-close';
      var closeButton = document.getElementById(closeButtonId);

      if (closeButton) {
        closeButton.addEventListener('click', function(e) {
          _this.remove();
        });
      }
    },
    
    bindActions() {
      var _this = this;
      var actions = this.actions || {};

      Object.keys(actions).forEach(function bindListenerForAction(name) {
        var id = _this.actionId(name);
        var action = document.getElementById(id);

        if (action) {
          action.addEventListener('click', function(e) {
            actions[name](_this);
          });
        }
      });
    },

    buildActions() {
      var _this = this;
      var html = '';
      var actions = this.actions || {};

      Object.keys(actions).forEach(function buildActionForName(name) {
        var id = _this.actionId(name);
        html += `<button id="${id}">${name}</button>`;
      });

      return html;
    },

    remove() {
      this.node.parentElement.removeChild(this.node);
    },
  });
};

export default Modal;
