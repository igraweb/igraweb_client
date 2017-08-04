/*jshint esversion: 6 */

import config from '../config';
import form from './form';

const Errors = config.components.Errors;

const { showErrors, clearErrors } = form;

var ImageForm = function(model) {
  this.repository = model.repository;
  this.model = model;

  this.size = model.html_attributes['data-version'] || 'thumbnail';

  Object.assign(this, {
    showErrors,

    clearErrors,

    isSize(other) {
      return this.size === other;
    },

    thumbnail() {
      var image = this.model;
      if (!image.content) {
        return '';
      }

      return `<img src="${image.content.thumb}">`;
    },

    template() {
      return `
        <label for="name">Name</label>
        <input id="name" type="text" name="data[attributes][name]" placeholder="Name" value="${this.model.name || ''}">
        <label for="size">Size</label>
        <select id="size" name="size">
          <option ${this.isSize('tiny') ? 'selected' : ''} value="tiny">Tiny</option>
          <option ${this.isSize('thumb') ? 'selected' : ''} value="thumb">Thumbnail</option>
          <option ${this.isSize('square') ? 'selected' : ''} value="square">Square</option>
          <option ${this.isSize('hero') ? 'selected' : ''} value="hero">Hero</option>
          <option ${this.isSize('original') ? 'selected' : ''} value="original">Original</option>
        </select>
        <label for="content">File</label>
        ${this.thumbnail()}
        <input id="content" type="file" name="data[attributes][content]">
      `;
    },

    build(form) {
      this.form = form;
      form.innerHTML = this.template();
    },

    validate() {
      var nameInput = this.form['data[attributes][name]'];
      var fileInput = this.form['data[attributes][content]'];
      var filePresent = fileInput.value;
      var contentPresent = this.model.content;

      this.errors = Errors();
      this.includeContent = true;

      if (!this.form) {
        this.errors.add('form', 'There must be a form');
      }
      if (!nameInput.value) {
        this.errors.add('name', 'There must be a name', nameInput);
      }

      if (!filePresent) {
        if (contentPresent) {
          this.includeContent = false;
        } else {
          this.errors.add('content', 'There must be a file', fileInput);
        }
      }
    },

    toData() {
      var formData;
      var size;
      var attributes = this.model.html_attributes;

      formData = new FormData(this.form);
      formData.append('data[type]', 'images');
      if (this.model.uid) {
        formData.append('data[attributes][uid]', this.model.uid);
      }

      // Don't remove the image if file input is empty
      if (!this.includeContent) {
        formData.delete('data[attributes][content]');
      }

      size = formData.get('size');
      formData.delete('size');

      attributes['data-version'] = size;

      Object.keys(attributes).forEach(function(attr) {
        var value = attributes[attr];

        formData.append(`data[attributes][html_attributes][${attr}]`, value);
      });

      return formData;
    },

    submit() {
      var _this = this;
      var model = this.model;
      var data;

      return new Promise(function(resolve, reject) {
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

export default ImageForm;
