/*jshint esversion: 6 */

var Aside = function() {
  Object.assign(this, {
    id: `igraweb-aside-${Date.now()}`,

    classNames: ['igraweb-root', 'igraweb-aside', 'igraweb-aside-left'],

    hide() {
      this.node.classList.add('igraweb-hidden');
    },

    show() {
      this.node.classList.remove('igraweb-hidden');
    },

    build(container) {
      var aside = document.createElement('aside');

      this.node = aside;

      this.bindShowHide();
      this.buildActions();
      this.bindActions(container);

      aside.setAttribute('id', this.id);
      this.classNames.forEach(function addClass(name) {
        aside.classList.add(name);
      });
      aside.innerHTML = this.template();

      container.insertAdjacentElement('afterbegin', aside);
    },

    actionCallbacks: {},

    action(name, fn) {
      this.actionCallbacks[name] = fn;
    },

    actionId(name) {
      var aside = this;

      return `${aside.id}-action-${name}`;
    },

    buildActions() {
      var aside = this;
      var callbacks =  this.actionCallbacks;
      var html = '';

      Object.keys(callbacks).forEach(function buildButton(name) {
        var id = aside.actionId(name);
        var buttonHtml = `<button id="${id}">${name}</button>`;

        html += buttonHtml;
      });

      this.actions = html;
    },

    bindActions(container) {
      var aside = this;
      var callbacks =  this.actionCallbacks;

      container.addEventListener('click', function interceptActionClick(e) {
        var action = Object.keys(callbacks).find(function findActionTarget(name) {
          return e.target.getAttribute('id') == aside.actionId(name);
        });

        if (!action) {
          return true; //Propogate
        }

        e.preventDefault();

        callbacks[action](aside);

        return false;
      });
    },

    bindShowHide() {
      var aside = this;
      var node = this.node;

      node.addEventListener('click', function(e) {
        if (node.classList.contains('igraweb-hidden')) {
          aside.show();
        }
      });

      document.addEventListener('click', function(e) {
        if (!e.target.closest(`#${aside.id}`)) {
          aside.hide();
        }
      });

      this.action('CLOSE', function hideAside(aside) {
        aside.hide();
      });
    },

    template() {
      return `
        <div class="igraweb-aside-inner">
          <header class="igraweb-aside-heading">${this.title}</header>
          <section class="igraweb-aside-body">${this.body}</section>
          <footer class="igraweb-aside-actions">${this.actions}</footer>
        </div>
      `;
    },
  });
};

export default Aside;
