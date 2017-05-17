/*jshint esversion: 6 */

import Utils from '../utils';
import base from './base';
import Page from '../models/page';

const {
  logError,
  queryString,
  handleFetchResponse,
  handleFetchError,
  rest,
} = Utils;

var pages = Object.assign({}, base);

Object.assign(pages, {
  model: Page,
  type: 'pages',

  returnThis() {
    var _this = this;
    return _this;
  },

  /**
   * Fetch a page by uid or slug.
   *
   * See {{#crossLink "igraweb/page:method"}}{{/crossLink}}
   *
   * @method
   * @param uidOrSlug
   * @param {Object} [params]
   * @param {boolean} [params.fetch]
   * If `false`, no fetch request will be made, but a promise will return
   * that will immediately resolve a new Page object with the uid or slug
   * provided.
   * @private
   */
  find(uidOrSlug, params = {}) {
    var _this = this;

    if (params.hasOwnProperty('fetch') && !params.fetch) {
      return new Promise(function resolveNewPage(resolve) {
        var json = { data: { attributes: {} } };

        if (uidOrSlug[0] === '/') {
          json.data.attributes.slug = uidOrSlug;
        } else {
          json.data.id = uidOrSlug;
        }

        resolve(_this.buildFromJson(json));
      });
    }

    delete params.fetch;

    if (uidOrSlug[0] === '/') {
      return _this.findBySlug.bind(_this)(uidOrSlug, params);
    } else {
      return _this.findByUid.bind(_this)(uidOrSlug, params);
    }
  },

  /**
   * Fetch a page by the slug
   *
   * @method
   * @private
   */
  findBySlug(slug, params) {
    var _this = this;
    var query = queryString(params);
    var url = `${_this.type}/router/${slug}?${query}`;

    return rest(url)
      .then(handleFetchResponse)
      .then(_this.buildFromJson.bind(_this))
      .catch(handleFetchError);
  },
});

export default pages;
