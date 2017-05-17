/*jshint esversion: 6 */

import config from '../config';

import templateRepo from '../repositories/templates';
import Utils from '../utils';
import form from './form';

const Errors = config.components.Errors;

const { showErrors, clearErrors } = form;

const { logError } = Utils;

var SectionForm = function(model) {
  this.repository = model.repository;
  this.model = model;

  Object.assign(this, {
    showErrors,

    clearErrors,

    buildTemplateLibrary() {
      var _this = this;
      var thumbnails = this.templates.map(function(template) {
        return `<div class="igraweb-flex-item-4 igraweb-thumbnail" data-igraweb-choose-template="${template.uid}" ${template.uid === _this.modelTemplateUid ? 'selected' : ''}>${template.thumbnail()}</div>`;
      });

      this.afterBuildCallbacks.bindChooseTemplate = function() {
        _this.form.addEventListener('click', function(e) {
          var templateNode = e.target.closest('[data-igraweb-choose-template]');
          var uid;

          if (!templateNode) {
            return true;
          }

          e.preventDefault();

          Array.from(_this.form.querySelectorAll('[data-igraweb-choose-template][selected]')).forEach(function(choiceNode) {
            choiceNode.removeAttribute('selected');
          });


          uid = templateNode.getAttribute('data-igraweb-choose-template');

          _this.setModelTemplate(uid);

          templateNode.setAttribute('selected', true);

          return false;
        });
      };
      
      return thumbnails.join('');
    },

    setModelTemplate(uid) {
      this.modelTemplateUid = uid;
    },

    templateLibrary() {
      return `
        <label>Template (pick one)</label>
        <div id="igraweb-template-library" class="igraweb-flex-row">${this.buildTemplateLibrary()}</div>
      `;
    },

    templateEditor() {
      return `
        <div id="igraweb-template-editor">
          <label for="template">Or write your own</label>
          <div id="template" class="igraweb-code-editor" name="template_html" placeholder="<div>HTML template</div>">${this.modelTemplate.html || ''}</div>
        </div>
      `;
    },

    template() {
      var template = `
        <label for="name">Name</label>
        <input id="name" type="text" name="data[attributes][name]" placeholder="Name" value="${this.model.name || ''}">
      `;
      var library = this.templateLibrary();
      var editor = this.templateEditor();

      if (this.model.isPersisted()) {
        return template + library;
      } else {
        return template + library + editor;
      }
    },

    build(form) {
      var _this = this;
      this.form = form;

      templateRepo.findAll({ 'page[size]': 300 }).then(function(templates) {
        _this.templates = templates;

        if (_this.model.isPersisted()) {
          _this.model
            .template()
            .then(function(template) {
              _this.modelTemplate = template;
              _this.modelTemplateUid = template.uid;
              _this.buildForm();
            });
        } else {
          _this.modelTemplate = new templateRepo.model({});
          _this.buildForm();
        }
      });
    },

    afterBuildCallbacks: {},

    showTemplateEditor() {
      this.removeTemplateEditor();
      this.form.insertAdjacentHTML('beforeend', this.templateEditor());
    },

    removeTemplateEditor() {
      var editor = this.form.querySelector('#template');
      if (editor) {
        editor.parentNode.removeChild(editor);
      }
    },

    buildForm() {
      this.form.innerHTML = this.template();
      Object.values(this.afterBuildCallbacks).forEach(function(fn) {
        fn();
      });
      igraweb.plugins.codeEditor(this.form);
    },

    validate() {
      var nameInput = this.form['data[attributes][name]'];
      var editor = this.form.querySelector('#template');

      this.errors = Errors();

      if (!this.form) {
        this.errors.add('form', 'There must be a form');
      }
      if (!nameInput.value) {
        this.errors.add('name', 'There must be a name', nameInput);
      }
      if (!this.modelTemplateUid && (editor && !editor.getContent())) {
        this.errors.add('template', 'There must be some content', editor);
      }
    },

    templateWasChanged() {
      return this.modelTemplate.uid && this.modelTemplate.uid !== this.modelTemplateUid;
    },

    toData() {
      var _this = this;
      var data = {
        attributes: {
          name: this.form['data[attributes][name]'].value,
        },
      };
      var editor = this.form.querySelector('#template');
      var chosenTemplateUid = this.modelTemplateUid;


      if (this.model.uid) {
        data.attributes.uid = this.model.uid;
      }

      return new Promise(function(resolve) {
        var templateData;

        if (editor && editor.getContent().length) {
          templateData = {
            name: `${data.attributes.name}-template`,
            html: editor.getContent(),
          };

          templateRepo
            .create(templateData)
            .then(function(template) {
              data.relationships = {
                template: { data: { id: template.uid } }
              };

              resolve(data);
            })
            .catch(function(error) {
              logError(error);
              reject(_this.errors);
            });
        } else if (chosenTemplateUid) {
          data.relationships = {
            template: { data: { id: chosenTemplateUid } }
          };

          resolve(data);
        }
      });
    },

    submit() {
      var _this = this;
      var model = this.model;

      if (this.templateWasChanged) {
        if (!confirm('Changing the template will result a blank section. Your content will not be destroyed, but you will have to re-add it. Are you sure?')) {
          return new Promise(function() {
            throw new Error('User rejected confirmation!');
          });
        }
      }

      return new Promise(function(resolve, reject) {
        var data;

        _this.validate();

        if (_this.errors.isAny()) {
          reject(_this.errors);
          _this.showErrors();
          return;
        }

        _this
          .toData()
          .then(function(data) {
            if (model.isPersisted()) {
              model.update(data.attributes, data.relationships).then(resolve);
            } else {
              _this.repository.create(data.attributes, data.relationships).then(resolve);
            }
          })
          .catch(logError);
      });
    },
  });
};

export default SectionForm;
