/*jshint esversion: 6 */

import igraweb from '../index';

const SectionForm = igraweb.components.SectionForm;
const TemplateForm = igraweb.components.TemplateForm;
const Modal = igraweb.components.Modal;

const { logError, router } = igraweb.utils;

var openSectionEditor = function(model) {
  if (model.isPersisted()) {
    model
      .render()
      .then(function() {
        buildSectionEditor(model);
      })
      .catch(logError);
  } else {
    buildSectionEditor(model);
  }
};

var reloadPage = function(msg) {
  return function() {
    if (msg) {
      alert(msg);
    }

    router.reload();
  };
};

var buildSectionEditor = function(model) {
  var modal = Modal();
  var form;
  var templateReloader = reloadPage('Changes to templates require a page reload');

  modal.model = model;
  modal.title = "<h2>Edit the content</h2>";
  modal.body = '<form id="igraweb-editContent" class="igraweb-root igraweb-form"></form>';

  modal.action('SAVE', function(modal) {
    modal.form.submit().then(function reloadContent(model) {
      model.render().then(function(html) {
        document.querySelectorAll(model.selector).forEach(function replaceContent(node) {
          igraweb.replaceOuterHTML(node, html);
        });
        modal.remove();
      });
    })
    .catch(logError);
  });

  if (model.isPersisted()) {
    modal.action('EDIT TEMPLATE', function editTemplateModal(modal) {
      var section = modal.model;

      section.template().then(function(template) {
        buildTemplateModal(modal, template, templateReloader);
      })
      .catch(logError);
    });

    modal.action('NEW TEMPLATE', function newTemplateModal(modal) {
      var section = modal.model;
      var template = new igraweb.templates.model({});

      buildTemplateModal(modal, template, function onSave(template) {
        section
          .update({}, { template: { data: { id: template.uid } } })
          .then(templateReloader)
          .catch(logError);
      });
    });
  }

  modal.action('CANCEL', function(modal) {
    modal.remove();
  });

  modal.build();

  form = SectionForm(model);
  modal.form = form;

  form.build(modal.node.querySelector('#igraweb-editContent'));

  return false;
};

var buildTemplateModal = function(modal, template, onSave) {
  var templateModal = Modal();

  var templateForm = TemplateForm(template);
  var form;

  templateModal.title = '<h2>Edit template</h2>';
  templateModal.body = '<form id="igraweb-editTemplate" class="igraweb-root igraweb-form"></form>';

  templateModal.action('SAVE', function submitForm(modal) {
    templateForm
      .submit()
      .then(function reloadContent(template) {
        onSave(template);
      })
      .catch(logError);
  });

  templateModal.action('CANCEL', function(modal) {
    modal.remove();
  });

  templateModal.build();

  form = templateModal.node.querySelector('#igraweb-editTemplate');

  templateForm.build(form);

  templateModal.form = templateForm;
};

igraweb.registerModelListener('section', 'click', function(model) {
  openSectionEditor(model);
});

