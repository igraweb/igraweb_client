/*jshint esversion: 6 */

import querystring from 'querystring';

import rest from './utils/rest';
import currentUser from './utils/current_user';
import router from './router';

var successStatuses = [200, 304];

/**
 * These are common utilies used in the app, especially for common handlers
 *
 * @class utils
 */
var utils = {
  /**
   * Trigger an event listener of type on el
   *
   * Adapted from http://stackoverflow.com/a/2706236/2536065
   *
   * @param el A HTML element
   * @param {String} type The name of an event type (e.g. 'click',
   *   'mouseover')
   * @method triggerEventListener
   * @public
   */
  triggerEventListener(el, type) {
    var evObj = document.createEvent('Events');
    evObj.initEvent(type, true, false);
    el.dispatchEvent(evObj);
  },

  /**
   * Alias for triggerEventListener
   *
   * @method trigger
   * @public
   */
  trigger() {
    return utils.triggerEventListener(...arguments);
  },

  /**
   * Get igraweb resource meta data for node
   *
   * @param node A HTML element
   * @param {Object} resources A map of resource names to repositories
   * @param {Array} inlineResources A collection of "inline" resources
   * @method resourceTypeFor
   * @public
   */
  resourceTypeFor(node, resources, inlineResources) {
    var attr;
    resources = resources || {};
    inlineResources = inlineResources || [];

    if (!node.classList.contains('igraweb-node')) {
      return;
    }

    for (var resourceName in resources) {
      attr = `data-igraweb-${resourceName}`;

      if (node.hasAttribute(attr)) {
        return {
          repositoryName: resources[resourceName],
          modelName: resourceName,
          uid: node.getAttribute(attr),
          inline: inlineResources.includes(resourceName),
        };
      }
    }
  },

  /**
   * Error handling callback
   *
   * @method logError
   * @public
   */
  logError(error) {
    console.error(error.message || error);
  },

  /**
   * Build a query string from a (potentially nested) object of params
   *
   * @method queryString
   * @public
   */
  queryString(params) {
    var flatParams = utils.flattenQueryObject(params);

    return querystring.stringify(flatParams);
  },

  /**
   * Flattens a nested object such that nested keys are in a nested query
   * string format.
   *
   * @example
   *   { foo: { bar: 'baz' } } => { 'foo[bar]': 'baz' }
   *
   * @method flattenQueryObject
   * @private
   */
  flattenQueryObject(obj, topLevel = true) {
    var flattened = {};

    Object.keys(obj).forEach(function flattenValues(key) {
      var value = obj[key];

      if (value && value.constructor === Object) {
        value = utils.flattenQueryObject(value, false);
        Object.keys(value).forEach(function mergeObject(innerKey) {
          var flatKey = `${key}//${innerKey}`;
          var flatValue = value[innerKey];
          var flatKeyParts;

          if (topLevel) {
            flatKeyParts = flatKey.split('//');
            flatKey = flatKeyParts.shift();
            flatKey += flatKeyParts
              .map(function wrapInBrackets(part) {
                return `[${part}]`;
              })
              .join('');
          }

          flattened[flatKey] = flatValue;
        });
      } else {
        flattened[key] = value;
      }
    });

    return flattened;
  },

  /**
   * Pass on json from successful fetch requests or handle bad requests
   *
   * @method handleFetchResponse
   * @public
   */
  handleFetchResponse(response) {
    var status = response.status;

    if (successStatuses.includes(status)) {
      return response.json();
    } else if (status === 404){
      return new Promise(function(resolve) {
        resolve({ data: { wasNotFound: true } });
      });
    } else if (status === 401){
      utils.router.unauthorized();
      throw new Error('Unauthorized, you must login');
    } else {
      throw new Error(`Request failed with status ${status}`);
    }
  },

  /**
   * Handle request errors
   *
   * @param {Error, String} An error
   * @method handleFetchError
   * @public
   */
  handleFetchError(error) {
    utils.logError(error);
    throw new Error(error);
  },

  /**
   * Authentication service
   *
   * See {{./utils/current_user.js}}
   *
   * @property currentUser
   * @public
   */
  currentUser,

  /**
   * Authenticated JSON API REST calls
   *
   * See {{./utils/rest.js}}
   *
   * @property rest
   * @public
   */
  rest,

  /**
   * Routing helper
   *
   * See {{./router.js}}
   *
   * @property router
   * @public
   */
  router,
};

export default utils;
