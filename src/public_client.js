/*jshint esversion: 6 */

import config from './config';

import pages from './repositories/pages';
import sections from './repositories/sections';
import texts from './repositories/texts';
import embeds from './repositories/embeds';
import images from './repositories/images';
import Utils from './utils';

const {
  logError,
  router,
} = Utils;

const { resources } = config

var publicClient = {
  /**
   * Load data-igraweb-* tags
   *
   * @method load
   * @public
   */
  load() {
    var _this = this;
    return new Promise(function(resolve) {
      _this.loadContent(document);
      _this.initNodes(document);
      _this.loadPage().then(resolve);
    });
  },

  /**
   * This should be called before loading the page so it doesn't
   * reload content rendered by the page
   *
   * @method loadContent
   * @private
   */
  loadContent(element) {
    var _this = this;

    ['section', 'text', 'embed', 'image'].forEach(function loadResource(resource) {
      var attr = `data-igraweb-${resource}`;
      var selector = `[${attr}]`;
      var repository = _this[resources[resource]];

      var nodes = element.querySelectorAll(selector);

      nodes.forEach(function initNode(node) {
        var uid = node.getAttribute(attr);

        repository
          .find(uid, { render_html: true })
          .then(function replaceHTML(model) {
            if (model.html) {
              _this.replaceOuterHTML(node, model.html);
            }
          })
          .catch(logError);
      });
    });
  },

  /**
   * Parse DOM for data-igraweb-* nodes and mark them.
   *
   * For slots, add section id to the element, so that it doesn't need to be
   * looked up later.
   *
   * TODO: This method is no longer particularly useful. All this can be
   * done on the backend.
   *
   * @method initNodes
   * @param element DOM Element to be used as the root node
   * @private
   */
  initNodes(element) {
    var _this = this;

    ['section', 'text', 'embed', 'image'].forEach(function loadResource(resource) {
      var attr = `data-igraweb-${resource}`;
      var selector = `[${attr}]`;
      var repository = _this[resources[resource]];

      var nodes = element.querySelectorAll(selector);

      nodes.forEach(function initNode(node) {
        var uid = node.getAttribute(attr);
        node.classList.add('igraweb-node');

        // FIXME: Nested sections will have their slots updated multiple
        //        times. How can we get around this?
        if (resource === 'section') {
          node.querySelectorAll('[data-igraweb-slot]').forEach(function(slotNode) {
            slotNode.classList.add('igraweb-node');
            slotNode.setAttribute('data-igraweb-section-id', uid);
          });
        }
      });
    });
  },

  /**
   * Load the data-igraweb-page node
   *
   * @method loadPage
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
          if (router.isAt('notFound')) {
            throw new Error('Page not found');
          } else {
            router.notFound();
          }
        } else {
          page.load(pageNode);
        }
      })
      .then(function loadTheRest() {
        _this.initNodes(pageNode);
      })
      .catch(logError);
  },

  pages,
  texts,
  embeds,
  images,
  sections,

  /**
   * Replace the content of a node and then load that content with igraweb
   *
   * @method replaceInnerHTML
   * @public
   */
  replaceInnerHTML(node, html) {
    var returnVal = node.innerHTML = html;
    this.initNodes(node);

    return returnVal;
  },

  /**
   * Replace the entire node and then load the new node with igraweb
   *
   * @method replaceOuterHTML
   * @public
   */
  replaceOuterHTML(node, html) {
    var div = document.createElement('div');
    var newNode;

    div.innerHTML = html;
    newNode = div.firstChild;

    this.initNodes(div);

    node.parentNode.replaceChild(newNode, node);

    return newNode;
  },

  /**
   * @property config
   * @public
   */
  config,
};

export default publicClient;
