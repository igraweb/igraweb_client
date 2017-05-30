/*jshint esversion: 6 */

/**
 * Helper for building tooltips
 *
 * @class
 * @public
 */
const Tooltip = function() {
  var tooltip = this;
  var node = document.createElement('div');

  tooltip.node = node;

  Object.assign(tooltip, {
    id: `igraweb-tooltip${Date.now()}`,

    classNames: ['igraweb-tooltip'],

    hidden: true,

    actionsContainerId() {
      return `${tooltip.id}-actions`;
    },

    actionsContainer() {
      var id = tooltip.actionsContainerId();

      return document.getElementById(id);
    },

    action(name, fn) {
      tooltip.actions = tooltip.actions || {};

      tooltip.actions[name] = fn;
    },

    template() {
      var id = tooltip.actionsContainerId();

      return `
<div id="${id}"></div>
      `;
    },

    build(container) {
      tooltip.container = container;
      tooltip.container.insertAdjacentElement('beforeend', tooltip.node);

      tooltip.applyClasses();
      tooltip.node.innerHTML = tooltip.template();
      tooltip.actionsContainer().innerHTML = tooltip.buildActions();
      tooltip.bindActions();
    },

    hide() {
      tooltip.hidden = true;
      tooltip.node.classList.add('igraweb-hidden');
    },

    show() {
      tooltip.hidden = false;
      tooltip.node.classList.remove('igraweb-hidden');
    },

    applyClasses() {
      if (tooltip.hidden) {
        tooltip.node.classList.add('igraweb-hidden');
      } else {
        tooltip.node.classList.remove('igraweb-hidden');
      }

      tooltip.node.classList.add(...tooltip.classNames);
      tooltip.container.classList.add('igraweb-tooltip-container');
    },

    actionId(name) {
      return `${tooltip.id}-action-${name}`;
    },

    actionNode(name) {
      var id = tooltip.actionId(name);

      return document.getElementById(id);
    },

    bindActions() {
      var actions = tooltip.actions || {};

      Object.keys(actions).forEach(function bindListenerForAction(name) {
        var actionNode = tooltip.actionNode(name);

        if (actionNode) {
          actionNode.addEventListener('click', function(e) {
            actions[name](tooltip);
          });
        }
      });
    },

    buildActions() {
      var html = '';
      var actions = tooltip.actions || {};

      Object.keys(actions).forEach(function buildActionForName(name) {
        var id = tooltip.actionId(name);
        html += `<button id="${id}">${name}</button>`;
      });

      return html;
    },

    remove() {
      tooltip.container.classList.remove('igraweb-tooltip-container');
      tooltip.container.removeChildElement(tooltip.node);
    },
  });
};

export default Tooltip;

