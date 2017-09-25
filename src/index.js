/*jshint esversion: 6 */

import config from './config';

import pages from './repositories/pages';
import sections from './repositories/sections';
import texts from './repositories/texts';
import embeds from './repositories/embeds';
import images from './repositories/images';
import slots from './repositories/slots';
import templates from './repositories/templates';
import Utils from './utils';
import testHelper from './tests/test_helper';

import publicClient from './public_client';

const {
  logError,
  currentUser,
  router,
  resourceTypeFor,
} = Utils;

const { resources, inlineResources } = config;

const { loadContent, initNodes, replaceOuterHTML, replaceInnerHTML } = publicClient;

const { testRunner } = testHelper;

/**
 * The main igraweb app and entrypoint to the entire api
 *
 * @class igraweb
 */
var igraweb = {
  /**
   * Replaces data-igraweb-* tags with content from backend
   *
   * @method load
   * @public
   */
  load() {
    var _this = this;

    if (config.runTests) {
      _this.loadTests();
    }

    if (router.isAt('login')) {
      router.unauthorized();
      return;
    }

    if (currentUser()) {
      _this.loadInitializers();
      _this.loadListeners();
      _this.loadAuthenticated();
    }

    return publicClient.load();
  },

  /**
   * @method loadContent
   * @private
   */
  loadContent,

  /**
   * Load the data-igraweb-page tag
   *
   * @method
   * @private
   */
  loadPage() {
    var _this = this;
    var pageNode = document.querySelector('[data-igraweb-page]');

    if (!pageNode) {
      return false;
    }

    var uid = pageNode.getAttribute('data-igraweb-page');

    if (!uid) {
      return false;
    }

    _this
      .pages
      .find(uid, { render_html: true })
      .then(function renderPage(page) {
        // Page not found
        if (page.wasNotFound) {
          if (currentUser.isAuthenticated()) {
            _this.pages
              .find(uid, { fetch: false })
              .then(function loadPage(page) {
                page.buildForm(pageNode);
              });
          } else {
            if (router.isAt('notFound')) {
              throw new Error('Page not found');
            } else {
              router.notFound();
            }
          }
        } else {
          page.load(pageNode).then(function() {
            if (currentUser.isAuthenticated()) {
              page.buildForm(pageNode);
            }
          });
        }
      })
      .then(function loadTheRest() {
        _this.initNodes(pageNode);
      })
      .catch(logError);
  },

  /**
   * Load all registered initializers. (See `config.initializers` and
   * `igraweb.registerInitializer`.)
   *
   * @method
   * @private
   */
  loadInitializers() {
    Object.values(this.initializers).forEach(function initialize(fn) {
      fn();
    });
  },

  /**
   * Run all tests. (See `config.runTests`.)
   *
   * @method
   * @private
   */
  loadTests() {
    require('./tests/router_test');
    require('./tests/models/collection_test');
    require('./tests/components/aside_test');
    require('./tests/utils/navigator_test');
    require('./tests/utils/current_user_test');
    require('./tests/utils_test');

    testRunner.load();
  },

  /**
   * Make DOM changes for authenticated user
   *
   * @method loadAuthenticated
   * @private
   */
  loadAuthenticated() {
    if (currentUser()) {
      document.body.classList.add('igraweb-authenticated');
    }
  },

  /**
   * @method initNodes
   * @private
   */
  initNodes,

  /**
   * Load all event listeners for resources
   *
   * If a resource has a slot, all events will fire on the slot, passing
   * along the resource event callbacks as well, so the slot can trigger
   * them if necessary or desired.
   *
   * If the resource is an "inline resource" (see config.inlineResource),
   * then it has priority, and slot events can be triggered from the
   * resource.
   *
   * NOTE: This is all very complicated. I really wish we could make it
   * simpler. At the moment it is very hard to change because it is hard
   * to understand.
   *
   * @method loadListeners
   * @private
   */
  loadListeners() {
    var _this = this;
    var listeners = _this.listeners || [];
    var element = document.body;

    Object.keys(listeners).forEach(function(eventName) {
      element.addEventListener(eventName, function(e) {
        var node;
        var igrawebParentNode;
        var slotNode;
        var resource;
        var repository;
        var model;
        var modelName;
        var inlineContent;
        var typeListeners = listeners[eventName] || {};
        var modelListeners;
        var listenerCaller;
        var promise;

        listenerCaller = function(node, model) {
          var args = Array.from(arguments).slice(2);

          modelListeners = typeListeners[model.model_name] || [];

          modelListeners.forEach(function(callback) {
            callback.call(node, model, ...args);
          });
        };

        if (!currentUser()) {
          return true;
        }

        node = e.target.closest('.igraweb-node');
        
        if (!node || node.classList.contains('igraweb-no-listeners')) {
          return true;
        }

        igrawebParentNode = node.parentNode.closest('.igraweb-node');

        if (igrawebParentNode && igrawebParentNode.hasAttribute('data-igraweb-slot')) {
          slotNode = igrawebParentNode;
        }

        resource = resourceTypeFor(node, resources, inlineResources);
        repository = _this[resource.repositoryName];
        modelName = resource.modelName;
        inlineContent = resource.inline;

        var callContentOrSlotListeners = function(model) {
          var contentActions;
          var sectionUid;
          var slotUid;

          if (slotNode && typeListeners.slot && !inlineContent) {
            contentActions = typeListeners[resource.modelName] || [];

            sectionUid = slotNode.getAttribute('data-igraweb-section-id');
            slotUid = slotNode.getAttribute('data-igraweb-slot');
            _this.slots
              .find(sectionUid, slotUid)
              .then(function(slot) {
                slot.content = model;
                slot.contentNode = node;
                slot.contentActions = contentActions;
                listenerCaller(slotNode, slot);
              });
          } else {
            listenerCaller(node, model, slotNode);
          }
        };

        if (resource.modelName === 'slot') {
          promise = repository
            .find(node.getAttribute('data-igraweb-section-id'), resource.uid, { fetch: false });
        } else {
          promise = repository.find(resource.uid, { fetch: false });
        }

        promise
          .then(callContentOrSlotListeners)
          .catch(logError);

        // Don't propogate events
        return false;
      });
    });
  },

  /**
   * @property plugins
   * @public
   */
  plugins: config.plugins,

  /**
   * @property listeners
   * @public
   */
  listeners: config.listeners,

  /**
   * @property initializers
   * @public
   */
  initializers: config.initializers,

  /**
   * Add an initializer function to be called when igraweb is loaded with
   * an authenticated user.
   *
   * Default initializers can be overriden by providing the same name.
   *
   * @param {String} name
   * @param fn {function} An initializer function
   * @method
   * @public
   */
  registerInitializer(name, fn) {
    this.initializers[name] = fn;
  },

  /**
   * @property components
   * @public
   */
  components: config.components,

  /**
   * Add an component contructor function that can be called to initialize
   * a component.
   *
   * Default components can be overriden by providing the same name.
   *
   * @param {String} name
   * @param fn {function} A contructor function
   * @method
   * @public
   */
  registerComponent(name, fn) {
    this.components[name] = fn;
  },

  /**
   * TODO: Check if this structure makes sense for adding/altering 
   *       listeners for third parties
   * Register an event to occur for an igraweb model node
   *
   * @method registerModelListener
   * @param modelName {String} e.g. 'text', 'embed', 'section', 'image', 'slot'
   * @param type {String} Event type
   * @param fn {function} Callback function triggered by event
   * @public
   */
  registerModelListener(modelName, type, fn) {
    var listeners = this.listeners || {};
    var typeListeners = listeners[type] || {};
    var modelListeners = typeListeners[modelName] || [];

    modelListeners.push(fn);
    typeListeners[modelName] = modelListeners;
    listeners[type] = typeListeners;

    this.listeners = listeners;
  },

  /**
   * @property resources
   * @public
   */
  resources: config.resources,

  /**
   * Pages repository
   *
   * @property pages
   * @public
   */
  pages,

  /**
   * Sections repository
   *
   * @property sections
   * @public
   */
  sections,

  /**
   * Texts repository
   *
   * @property texts
   * @public
   */
  texts,

  /**
   * Embeds repository
   *
   * @property embeds
   * @public
   */
  embeds,

  /**
   * Images repository
   *
   * @property images
   * @public
   */
  images,

  /**
   * Slots repository
   *
   * @property slots
   * @public
   */
  slots,

  /**
   * Templates repository
   *
   * @property templates
   * @public
   */
  templates,

  /**
   * @property utils
   * @public
   */
  utils: Utils,

  /**
   * Igraweb config object
   *
   * @property config
   * @public
   */
  config,

  /**
   * @method replaceOuterHTML
   * @public
   */
  replaceOuterHTML,

  /**
   * @method replaceInnerHTML
   * @public
   */
  replaceInnerHTML,
};

export default igraweb;
