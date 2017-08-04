/*jshint esversion: 6 */

import igraweb from '../index';

const TextForm = igraweb.components.TextForm;
const Modal = igraweb.components.Modal;
const Tooltip = igraweb.components.Tooltip;

const { logError, currentUser, trigger } = igraweb.utils;

igraweb.config.inlineResources.push('text');

var openTextEditor = function(model) {
  if (model.isPersisted()) {
    model.render().then(function() {
      buildTextEditor(model);
    });
  } else {
    buildTextEditor(model);
  }
};

var buildTextEditor = function(model) {
  var modal = Modal();
  var form;

  modal.model = model;
  modal.title = "<h2>Edit the content</h2>";
  modal.body = '<form id="igraweb-editContent" class="igraweb-form"></form>';

  modal.action('SAVE', function(modal) {
    modal.form
      .submit()
      .then(function reloadContent(model) {
        model
          .render()
          .then(function(html) {
            document.querySelectorAll(model.selector).forEach(function replaceContent(node) {
              igraweb.replaceOuterHTML(node, html);
            });
            modal.remove();
          });
      })
      .catch(logError);
  });

  modal.action('CANCEL', function(modal) {
    modal.remove();
  });

  modal.build();

  form = TextForm(model);
  modal.form = form;

  form.build(modal.node.querySelector('#igraweb-editContent'));

  return false;
};

var inlineTextEditor = function(node, model, slotNode) {
  model.render().then(function() {
    var editor = document.createElement('div');
    var tooltip = Tooltip();
    var clickOutsideListener;
    var close;

    node = igraweb.replaceOuterHTML(node, model.html);

    editor.classList.add('igraweb-text-editor');
    node.classList.add('igraweb-no-listeners');

    editor.innerHTML = node.innerHTML;
    node.innerHTML = editor.outerHTML;

    close = function() {
      document.removeEventListener('click', clickOutsideListener);

      model.html = null;
      model.render().then(function(html) {
        document.querySelectorAll(model.selector).forEach(function(node) {
          igraweb.replaceOuterHTML(node, html);
        });
      });
    };

    tooltip.action('SAVE', function(tooltip) {
      var newContent = node.querySelector('.igraweb-text-editor').getContent();
      model.update({ content: newContent }).then(function(model) {
        close();
      });
    });

    tooltip.action('ADVANCED', function(tooltip) {
      close();
      openTextEditor(model);
    });
    
    if (slotNode) {
      tooltip.action('UPDATE SLOT', function(tooltip) {
        close();
        trigger(slotNode, 'openEditor');
      });
    }

    tooltip.action('CANCEL', function(tooltip) {
      close()
    });

    node.addEventListener('mouseenter', function(e) {
      tooltip.show();
    });

    node.addEventListener('mouseleave', function(e) {
      tooltip.hide();
    });

    clickOutsideListener = function(e) {
      if (e.target.closest('.igraweb-node') === node) {
        return;
      }

      e.preventDefault();
      close();
      return false;
    };

    document.addEventListener('click', clickOutsideListener);

    tooltip.build(node);

    igraweb.plugins.textEditor(node);
  });
};

igraweb.registerModelListener('text', 'click', function(model, slotNode) {
  var node = this;

  inlineTextEditor(node, model, slotNode);
});

igraweb.registerModelListener('text', 'mouseover', function(model) {});
