/*jshint esversion: 6 */

import assert from 'assert';

import base from './base';
import Image from '../models/image';

import Utils from '../utils';

const {
  logError,
  handleFetchResponse,
  handleFetchError,
  rest,
} = Utils;
var images = Object.assign({}, base);

Object.assign(images, {
  model: Image,
  type: 'images',

  createWithJson: images.create,
  updateWithJson: images.update,

  create(data) {
    if (data && data.constructor === FormData) {
      return this.createWithFormData(...arguments);
    } else {
      return this.createWithJson(...arguments);
    }
  },

  update(model, data) {
    assert(model && model.constructor === this.model, 'You must pass a model to be updated');

    if (data && data.constructor === FormData) {
      return this.updateWithFormData(...arguments);
    } else {
      return this.updateWithJson(...arguments);
    }
  },

  createWithFormData(formData) {
    var _this = this;
    var fetchOptions = { method: 'POST', body: formData };

    return rest(`${_this.type}`, fetchOptions)
      .then(handleFetchResponse)
      .then(_this.buildFromJson.bind(_this))
      .catch(handleFetchError);
  },

  updateWithFormData(model, formData) {
    var _this = this;
    var uid = model.uid;
    var url = `${_this.type}/${uid}`;

    assert(uid, 'There must be a uid');

    return rest(url, { method: 'PATCH', body: formData })
      .then(handleFetchResponse)
      .then(_this.buildFromJson.bind(_this))
      .catch(handleFetchError);
  },
});

export default images;

