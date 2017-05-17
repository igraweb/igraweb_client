/*jshint esversion: 6 */

import igraweb from '../index';

const TextForm = igraweb.components.TextForm;
const Modal = igraweb.components.Modal;

const { logError, currentUser } = igraweb.utils;

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

igraweb.registerModelListener('text', 'click', function(model) {
  openTextEditor(model);
});
igraweb.registerModelListener('text', 'mouseover', function(model) {});
