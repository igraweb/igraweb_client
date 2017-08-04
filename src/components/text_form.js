/*jshint esversion: 6 */

import config from '../config';

import Errors from './errors';
import form from './form';

const { showErrors, clearErrors } = form;

var TextForm = function(model) {
  this.repository = model.repository;
  this.model = model;

  Object.assign(this, {
    showErrors,

    clearErrors,

    template() {
      return `
        <label for="name">Name</label>
        <input id="name" type="text" name="data[attributes][name]" placeholder="Name" value="${this.model.name || ''}">
        <label for="content">Content</label>
        <div id="content" class="igraweb-text-editor" name="data[attributes][content]" placeholder="Add some content">${this.model.content || ''}</div>
      `;
    },

    build(form) {
      this.form = form;
      form.innerHTML = this.template();
      config.plugins.textEditor(form);
    },

    validate() {
      var nameInput = this.form['data[attributes][name]'];
      var contentInput = this.form.querySelector('#content');
      this.errors = new Errors();

      if (!this.form) {
        this.errors.add('form', 'There must be a form');
      }
      if (!nameInput.value) {
        this.errors.add('name', 'There must be a name', nameInput);
      }
      if (!contentInput.getContent()) {
        this.errors.add('content', 'There must be some content', contentInput);
      }
    },

    toData() {
      var formData = {
        'name': this.form['data[attributes][name]'].value,
        'content': this.form.querySelector('#content').getContent(),
      };

      if (this.model.uid) {
        formData.uid = this.model.uid;
      }

      return formData;
    },

    submit() {
      var _this = this;
      var model = this.model;
      return new Promise(function(resolve, reject) {
        var data;

        _this.validate();

        data = _this.toData();

        if (_this.errors.isAny()) {
          reject(_this.errors);
          _this.showErrors();
          return;
        }

        if (model.isPersisted()) {
          model.update(data).then(resolve);
        } else {
          _this.repository.create(data).then(resolve);
        }
      });
    },
  });
};

export default TextForm;
