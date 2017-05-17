/*jshint esversion: 6 */

import assert from 'assert';

import Utils from '../utils';
import Slot from '../models/slot';

const {
  logError,
  queryString,
  handleFetchResponse,
  handleFetchError,
  rest,
} = Utils;

var slots = {
  model: Slot,
  type: 'slots',

  find(sectionUid, uid, params = {}) {
    assert(sectionUid, 'There must be a section uid');
    assert(uid, 'There must be a model uid');

    var _this = this;

    return new Promise(function resolveNewPage(resolve) {
      var json = {
        data: {
          id: uid,
          relationships: { section: { data: { id: sectionUid } } },
        },
      };

      resolve(_this.buildFromJson(json));
    });
  },

  update(sectionUid, model, relationships) {
    var _this = this;

    assert(sectionUid, 'There must be a section uid');
    assert(model.uid, 'There must be a model uid');

    var url = `sections/${sectionUid}/slots/${model.uid}`;
    var headers = new Headers();
    var data = { data: { type: _this.type, relationships } };
    var body = JSON.stringify(data);

    headers.append('Content-Type', 'application/json');

    return rest(url, { method: 'PATCH', body, headers })
      .then(handleFetchResponse)
      .then(_this.buildFromJson.bind(_this))
      .catch(handleFetchError);
  },

  buildFromJson(json) {
    return new this.model(json.data);
  },
};

export default slots;

