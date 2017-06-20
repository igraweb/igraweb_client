/*jshint esversion: 6 */

import config from '../config';

import Utils from '../utils';
import base from './base';
import pages from '../repositories/pages';
import sections from '../repositories/sections';

const PageForm = config.components.PageForm;
const Aside = config.components.Aside;

const { logError, currentUser, router } = Utils;

function Page(json) {
  this.model_name = 'page';

  Object.assign(this, base);

  this.fromJson(json);

  if (this.slug) {
    this.selector = `[data-igraweb-page=${this.uid}], [data-igraweb-page="${this.slug}"]`;
  }

  /**
   * HTML meta content for page
   *
   * @property
   * @public
   */
  this.html_meta = this.html_meta || {};

  /**
   * Set meta tags and load html content into the node
   *
   * @method
   * @public
   */
  this.load = function(node) {
    var page = this;

    if (!node) {
      throw new Error(`Page node not found: no node with selector ${page.selector} could be found`);
    }

    return new Promise(function renderPage(resolve) {
      page.setMeta();
      page
        .render()
        .then(function updatePageInnerHtml(html) {
          node.innerHTML = html;
          resolve();
        })
        .catch(logError);
    });
  };

  // TODO: Move the removal of old meta tags and adding the new meta tags
  //       into some other service.
  /**
   * Set meta and title tags in head
   *
   * @method
   * @public
   */
  this.setMeta = function() {
    var head = document.head;
    var title = document.querySelector('title');

    head
      .querySelectorAll('[data-igraweb-meta]')
      .forEach(function removeNode(node) {
        node.parentNode.removeChild(node);
      });

    for (var property in this.html_meta) {
      var content = this.html_meta[property];
      var html;

      if (property === 'title') {
        if (title.parentElement) {
          title.parentElement.removeChild(title);
        }
        html = `<title data-igraweb-meta>${content}</title>`;
      } else {
        html = `<meta property="${property}" content="${content}" data-igraweb-meta>`;
      }
      head.insertAdjacentHTML('beforeend', html);
    }
  };

  this.buildForm = function(node) {
    var page = this;
    var form = PageForm(page);
    var aside = Aside();
    var formNode;

    aside.title = '<h2>Edit Page</h2>';
    aside.body = `
      <p>Edit page meta data<p>
      <form id="igraweb-pageForm" class="igraweb-form"></form>
    `;

    aside.action('SAVE', function submitForm(aside) {
      var form = aside.form;

      form.submit().then(function(model) {
        if (model.slug) {
          router.redirect(model.slug);
        } else {
          router.reload();
        }
      });
    });

    aside.build(node);
    aside.hide();

    formNode = aside.node.querySelector('#igraweb-pageForm');

    form.build(formNode);

    aside.form = form;
  };

  Object.assign(this, {
    section() {
      var section = this.relationships.section;

      return new Promise(function(resolve, reject) {
        if (!section) {
          reject();
        }

        sections.find(section.data.id).then(resolve);
      });
    },
  });

  this.repository = pages;
}

export default Page;
