/*jshint esversion: 6 */

import assert from 'assert';

import Utils from '../utils';
const { logError } = Utils;

/**
 * Common JSON API entity and application handling
 */
var base = {
  // Extract properties if json is included, otherwise only build functions
  fromJson(json) {
    assert(!!this.model_name, "You must set a model name for your model before including Base");

    this.wasNotFound = json.wasNotFound;

    var attributes = json.attributes || {};

    /**
     * Store the original json
     *
     * @property
     * @private
     */
    this.json = json;

    /**
     *
     * @property
     * @public
     */
    this.uid = this.uid || json.id;

    /**
     * Properties set directly from igraweb
     */
    Object.assign(this, attributes);

    /**
     * @property
     * @private
     */
    this.relationships = json.relationships || {};

    /**
     * Query selector for DOM, and DOM Element
     *
     * The selector first tries to use the uid, then tries to use the slug
     */
    if (this.uid) {
      this.selector = `[data-igraweb-${this.model_name}=${this.uid}]`;
    }
  },

  /**
   * The repository object used to update server data
   *
   * This must be set in objects that inherit from Content
   *
   * @property
   * @public
   */
  repository: null,

  /**
   * Upate the page via the JSON REST API
   *
   * @method
   * @public
   */
  update() {
    return this.repository.update(this, ...arguments);
  },

  /**
   * Delete the page via the JSON REST API
   *
   * @method
   * @public
   */
  destroy() {
    return this.repository.destroy(this);
  },

  /** 
   * Get the HTML Representation for the model
   *
   * If the model already has HTML set the promise resolves immediately
   *
   * @method
   * @public
   */
  render() {
    var _this = this;

    return new Promise(function fetchHtml(resolve, reject) {
      if (_this.html) {
        resolve(_this.html);
      } else {
        _this.repository
          .find(_this.uid, { render_html: true })
          .then(function setHtmlFromResponse(fetched) {
            _this.fromJson(fetched.json);
            resolve(_this.html);
          })
          .catch(logError);
      }
    });
  },

  isPersisted() {
    return !this.wasNotFound && this.uid;
  },

  isNewRecord() {
    return !this.isPersisted();
  },

  isSlotContent() {
    return false;
  },

  thumbnail() {
    return `
      <div>
        <h6>
          ${this.name}
          <br>
          <small>${this.uid}</small>
        </h6>
      </div>
    `;
  },
};

export default base;
