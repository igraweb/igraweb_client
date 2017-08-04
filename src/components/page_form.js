/*jshint esversion: 6 */

import config from '../config';
import form from './form';

const Errors = config.components.Errors;

const { showErrors, clearErrors } = form;

var PageForm = function(model) {
  this.repository = model.repository;
  this.model = model;

  Object.assign(this, {
    showErrors,

    clearErrors,

    template() {
      return `
        <label for="name">Name</label>
        <input id="name" type="text" name="data[attributes][name]" placeholder="Name" value="${this.model.name || ''}">
        <label for="slug">Slug</label>
        <input id="slug" type="text" name="data[attributes][slug]" placeholder="/path/to/page" value="${this.model.slug || ''}">
        <label for="title">Title</label>
        <input id="title" type="text" name="title" placeholder="Title | Your Site" value="${this.model.html_meta.title || ''}">
        <label for="description">Description (~160 characters)</label>
        <input id="description" type="text" name="description" placeholder="This page is about ..." value="${this.model.html_meta.description || ''}">
        <label for="keywords">Keywords (separated by ',')</label>
        <input id="keywords" type="text" name="keywords" placeholder="keyword, ..." value="${this.model.html_meta.keywords || ''}">
      `;
    },

    build(form) {
      this.form = form;
      form.innerHTML = this.template();
    },

    validate() {
      var nameInput = this.form['data[attributes][name]'];
      this.errors = Errors();

      if (!this.form) {
        this.errors.add('form', 'There must be a form');
      }
      if (!nameInput.value) {
        this.errors.add('name', 'There must be a name', nameInput);
      }
    },

    toData() {
      var meta = this.model.html_meta;
      var formData = {
        name: this.form['data[attributes][name]'].value,
        slug: this.form['data[attributes][slug]'].value,
        html_meta: meta,
      };

      meta.title = this.form.title.value;
      meta.description = this.form.description.value;
      meta.keywords = this.form.keywords.value;

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

export default PageForm;

