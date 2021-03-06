/*jshint esversion: 6 */

import igraweb from '../index';

const ImageForm = igraweb.components.ImageForm;
const Modal = igraweb.components.Modal;

const { logError, currentUser } = igraweb.utils;

var openImageEditor = function(model) {
  model.render().then(function() {
    buildImageEditor(model);
  });
};

var buildImageEditor = function(model) {
  var modal = Modal();
  var form;

  modal.model = model;
  modal.title = '<h2>Edit Image</h2>';
  modal.body = '<form id="igraweb-editContent" class="igraweb-root igraweb-form"></form>';

  modal.action('SAVE', function(modal) {
    modal.form.submit().then(function reloadContent(model) {
      model.render().then(function(html) {
        document.querySelectorAll(model.selector).forEach(function replaceContent(node) {
          igraweb.replaceOuterHTML(node, html);
        });

        modal.remove();
      });
    });
  });

  modal.action('CANCEL', function(modal) {
    modal.remove();
  });

  modal.build();

  form = ImageForm(model);
  modal.form = form;

  form.build(modal.node.querySelector('#igraweb-editContent'));
};

igraweb.registerModelListener('image', 'click', function(model) {
  openImageEditor(model);
});
