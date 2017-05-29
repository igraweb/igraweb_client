/*jshint esversion: 6 */

import querystring from 'querystring';

import resources from './utils/resources';
import rest from './utils/rest';
import currentUser from './utils/current_user';
import router from './router';

var successStatuses = [200, 304];

/**
 * These are common utilies used in the app, especially for common handlers
 */
var utils = {
  /**
   * Trigger an event listener of type on el
   *
   * Adapted from http://stackoverflow.com/a/2706236/2536065
   *
   * @method
   * @public
   */
  triggerEventListener(el, type) {
    var evObj = document.createEvent('Events');
    evObj.initEvent(type, true, false);
    el.dispatchEvent(evObj);
  },

  trigger() {
    return utils.triggerEventListener(...arguments);
  },

  /**
   * Get igraweb resource type for node
   *
   * @method
   * @public
   */
  resourceTypeFor(node) {
    var attr;

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
        };
      }
    }
  },

  /**
   * @method
   * @public
   */
  logError(error) {
    console.error(error);
  },

  /**
   * Build a query string from an object of params
   *
   * @method
   * @public
   */
  queryString(params) {
    var flatParams = utils.flattenQueryObject(params);

    return querystring.stringify(flatParams);
  },

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
   * Pass on successful fetch requests 
   *
   * @method
   * @public
   */
  handleFetchResponse(response) {
    var status = response.status;

    if (successStatuses.include(status)) {
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
   * @method
   * @public
   */
  handleFetchError(error) {
    console.error(error);
    throw new Error(error);
  },

  /**
   * Authentication service
   *
   * See {{./utils/current_user.js}}
   */
  currentUser,

  /**
   * Map of singular to plural resource names
   */
  resources,

  /**
   * Authenticated JSON API REST calls
   */
  rest,

  /**
   * routing helper
   */
  router,
};

export default utils;
