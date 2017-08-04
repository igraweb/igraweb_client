/*jshint esversion: 6 */

import config from '../config';

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

    template() {
      return `
        <label for="name">Name</label>
        <input id="name" type="text" name="data[attributes][name]" placeholder="Name" value="${this.model.name || ''}">
        <label for="template">Template</label>
        <div id="template" class="igraweb-code-editor" name="data[attributes][html]" placeholder="<div>HTML template</div>">${this.model.html || ''}</div>
      `;
    },

    build(form) {
      var _this = this;
      this.form = form;

      this.form.innerHTML = this.template();
      config.plugins.codeEditor(form);
    },

    validate() {
      var nameInput = this.form['data[attributes][name]'];
      var contentInput = this.form.querySelector('#template');
      this.errors = Errors();

      if (!this.form) {
        this.errors.add('form', 'There must be a form');
      }
      if (!nameInput.value) {
        this.errors.add('name', 'There must be a name', nameInput);
      }
      if (!contentInput.getContent()) {
        this.errors.add('html', 'There must be some html', contentInput);
      }
    },

    toData() {
      return {
        name: this.form['data[attributes][name]'].value,
        html: this.form.querySelector('#template').getContent(),
      };
    },

    submit() {
      var _this = this;
      var model = this.model;
      var data;

      return new Promise(function(resolve, reject) {
        _this.validate();

        if (_this.errors.isAny()) {
          reject(_this.errors);
          _this.showErrors();
          return;
        }

        data = _this.toData();

        if (model.isPersisted()) {
          model.update(data).then(resolve);
        } else {
          _this.repository.create(data).then(resolve);
        }
      });
    },
  });
};

export default SectionForm;
