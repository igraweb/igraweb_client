/*jshint esversion: 6 */

import igraweb from '../index';

const TextForm = igraweb.components.TextForm;
const ImageForm = igraweb.components.ImageForm;
const EmbedForm = igraweb.components.EmbedForm;
const SectionForm = igraweb.components.SectionForm;
const Modal = igraweb.components.Modal;
const Library = igraweb.components.Library;

const { logError, router } = igraweb.utils;

/**
 * List of content forms mapped to the repository type
 *
 * @property
 * @private
 */
var contentForms = {
  images: ImageForm,
  texts: TextForm,
  embeds: EmbedForm,
  sections: SectionForm,
};

/**
 * Replace the content form
 *
 * @method
 * @private
 */
var updateContentForm = function(modal, node, repository) {
  var resource = repository.type;
  var container = node.querySelector('#newContent');
  var formComponent = contentForms[resource];
  var form;

  if (!formComponent) {
    container.innerHTML = '';
    modal.form = null;
    return;
  }
    
  var model = new repository.model({});
  form = formComponent(model);
  modal.form = form;

  form.build(container);
};

/**
 * Replace the contents of the library
 *
 * @method
 * @private
 */
var updateLibrary = function(node, repository) {
  var library = Library(repository);

  library.pageSize = 4;
  library.build(node.querySelector('#library'));
};

/**
 * Update the slot editor when the content type is changed
 *
 * @method
 * @private
 */
var updateContentType = function(modal) {
  var { node, repository } = modal;

  updateLibrary(node, repository);
  updateContentForm(modal, node, repository);
};

/**
 * Build the slot editor with library and new content form
 *
 * @method
 * @private
 */
var openSlotEditor = function(model) {
  var content = model.content || new igraweb.texts.model({});
  var modal = Modal();

  modal.model = model;
  modal.repository = content.repository;
  modal.size = 'xl';

  modal.title = "<h2>Edit Slot</h2>";
  modal.body = `
    <h3>Select a content type</h3>
    <nav class="igraweb-flex-row igraweb-content-tabs">
      <a data-choose-resource="images" href="#"><span class="igraweb-icon">&#58;</span> Image</a>
      <a data-choose-resource="texts" href="#"><span class="igraweb-icon">&#67;</span> Text</a>
      <a data-choose-resource="embeds" href="#"><span class="igraweb-icon">&#8482;</span> Embed</a>
      <a data-choose-resource="sections" href="#"><span class="igraweb-icon">&#102;</span> Section</a>
    </nav>
    <h3>Library <small>(choose from existing content)</small></h3>
    <div id="library"></div>
    <h3>Upload <small>(or create new content)</small></h3>
    <form class="igraweb-form" id="newContent"></form>
  `;

  modal.action('CREATE', function(modal) {
    var slot = modal.model;

    if (!modal.form) {
      return;
    }

    modal.form
      .submit()
      .then(function updateSlot(model) {
        var uid = model.uid;
         
        slot
          .update({ content: { data: { id: uid } } })
          .then(function(slot) {
            model.html = null;
            model.render().then(function(html) {
              document.querySelectorAll(slot.selector).forEach(function(node) {
                igraweb.replaceInnerHTML(node, html);
              });
              modal.remove();
            });
          });
      })
      .catch(logError);
  });

  modal.action('CANCEL', function(modal) {
    modal.remove();
  });

  modal.build();

  modal.node.addEventListener('click', function(e) {
    var resource;
    var contentChosen;

    if (e.target.closest('[data-choose-resource]')) {
      resource = e.target.closest('[data-choose-resource]').getAttribute('data-choose-resource');

      modal.repository = igraweb[resource];

      updateContentType(modal);
    } else if (e.target.closest('[data-choose-content]')) {
      contentChosen = e.target.closest('[data-choose-content]').getAttribute('data-choose-content');


      model.update({ content: { data: { id: contentChosen } } }).then(function(slot) {
        modal.repository.find(contentChosen, { render_html: true })
          .then(function(content) {
            document.querySelectorAll(model.selector).forEach(function(node) {
              igraweb.replaceInnerHTML(node, content.html);
            });
          })
          .catch(function (error) {
            logError(error);
            router.reload();
          });
        modal.remove();
      });
    } else {
      return true;
    }

    e.preventDefault();
    return false;
  });

  updateContentType(modal);
};

/**
 * User can choose whether he or she would like to edit the current content
 * or edit the content related to the slot
 *
 * @method
 * @private
 */
var confirmEditChoice = function(model) {
  var content = model.content;
  var modal = Modal();

  modal.title = "<h2>Edit Slot</h2>";
  modal.body = "<p>Do you want to edit this slot (replace or remove content) or do you want to edit this content directly?</p>";

  modal.action('UPDATE SLOT', function(modal) {
    modal.remove();
    openSlotEditor(model);
  });

  if (model.content && model.contentNode) {
    modal.action('UPDATE CONTENT', function(modal) {
      modal.remove();
      model.contentActions.forEach(function callContentActions(callback) {
        callback.call(model.contentNode, model.content);
      });
    });
  }

  modal.action('CANCEL', function(modal) {
    modal.remove();
  });
  
  modal.build();
};

igraweb.registerModelListener('slot', 'click', confirmEditChoice);
