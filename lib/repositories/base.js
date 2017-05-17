/*jshint esversion: 6 */

import assert from 'assert';
import Utils from '../utils';

import Collection from '../models/collection';

const {
  logError,
  queryString,
  handleFetchResponse,
  handleFetchError,
  rest,
} = Utils;

/**
 * Common JSON API entity and application handling
 *
 * @class repositories.base
 */
var base = {
  /**
   * Fetch a list of resources from the JSON REST API
   *
   * @method
   * @public
   */
  findAll(params = {}) {
    var _this = this;

    var query = queryString(params);
    var url = `${_this.type}?${query}`;
    return rest(url)
      .then(handleFetchResponse)
      .then(_this.buildFromJsonArray.bind(_this))
      .catch(handleFetchError);
  },

  paginate(url) {
    var _this = this;

    return rest(url, { fullUrl: true })
      .then(handleFetchResponse)
      .then(_this.buildFromJsonArray.bind(_this))
      .catch(handleFetchError);
  },

  find(uid, params = {}) {
    var _this = this;

    if (params.hasOwnProperty('fetch') && !params.fetch) {
      return new Promise(function resolveNewModel(resolve) {
        var json = { data: { id: uid } };

        resolve(_this.buildFromJson(json));
      });
    }

    delete params.fetch;

    return _this.findByUid(uid, params);
  },

  /**
   * Persist a new model via the JSON REST API
   *
   * @method
   * @public
   */
  create(attributes, relationships) {
    var _this = this;
    var headers = new Headers();
    var data = { data: { type: _this.type, attributes, relationships } };
    var body = JSON.stringify(data);
    var fetchOptions = { method: 'POST', body, headers };

    headers.append('Content-Type', 'application/json');

    return rest(`${_this.type}`, fetchOptions)
      .then(handleFetchResponse)
      .then(_this.buildFromJson.bind(_this))
      .catch(handleFetchError);
  },

  /**
   * Upate the model via the JSON REST API
   *
   * @method
   * @public
   */
  update(model, attributes, relationships) {
    var _this = this;
    var uid = model.uid;

    assert(uid, 'There must be a uid');

    var url = `${_this.type}/${uid}`;
    var headers = new Headers();
    var data = { data: { type: _this.type, attributes, relationships } };
    var body = JSON.stringify(data);

    headers.append('Content-Type', 'application/json');

    return rest(url, { method: 'PATCH', body, headers })
      .then(handleFetchResponse)
      .then(_this.buildFromJson.bind(_this))
      .catch(handleFetchError);
  },

  /**
   * Delete the model via the JSON REST API
   *
   * @method
   * @public
   */
  destroy(model) {
    var _this = this;
    var uid = model.uid;

    assert(uid, 'There must be a uid');

    if (!confirm('Are you sure?')) {
      return false;
    }

    var url = `${_this.type}/${uid}`;

    return rest(url, { method: 'DELETE' })
      .then(handleFetchResponse)
      .then(_this.buildFromJson.bind(_this))
      .catch(handleFetchError);
  },

  /**
   * Fetch a model by the uid
   *
   * @method
   * @private
   */
  findByUid(uid, params) {
    var _this = this;
    var query = queryString(params);
    var url = `${_this.type}/${uid}?${query}`;

    return rest(url)
      .then(handleFetchResponse)
      .then(function buildModel(json) {
        var model = _this.buildFromJson(json);

        if (model.wasNotFound) {
          model.uid = uid;
        }

        return model;
      })
      .catch(handleFetchError);
  },

  /**
   * @method
   * @private
   */
  buildFromJson(json) {
    return new this.model(json.data);
  },

  /**
   * @method
   * @private
   */
  buildFromJsonArray(jsonArray) {
    var _this = this;
    var links = jsonArray.links || {};
    var data = jsonArray.data || [];
    var models = data.map(function(json) {
      return new _this.model(json);
    });

    return Collection(links, models, _this);
  },

  /**
   * Must be set by object that inherits from base
   *
   * @property
   * @public
   */
  model: null,

  /**
   * Must be sest by object that inherits from base
   *
   * @property
   * @public
   */
  type: null,
};

export default base;
