/*jshint esversion: 6 */

import SearchForm from './search_form';
import Utils from '../utils';

const { logError } = Utils;

var Library = function(repository) {
  Object.assign(this, {
    id: `igraweb-library-${Date.now()}`,

    collection: [],

    pageSize: 8,

    thumbnails() {
      return this.collection.map(function(model) {
        return `
          <div class="igraweb-flex-item-4 igraweb-thumbnail" data-choose-content="${model.uid}">
            ${model.thumbnail()}
          </div>
        `;
      });
    },

    template() {
      var thumbnails = this.thumbnails();

      return `
        <div class="igraweb-flex-row igraweb-flex-edge igraweb-row-padding-md">
          ${this.prevPageButton()}
          ${this.nextPageButton()}
        </div>
        <p><small id="${this.id}-notice">${this.notice || ''}</small></p>
        <div class="igraweb-flex-row">${thumbnails.join('')}</div>
        <form class="igraweb-form" id="${this.id}-searchForm"></form>
      `;
    },

    prevPageButton() {
      if (!this.collection.hasPrevPage) {
        return '';
      }

      return `
        <button class="igraweb-button" id="${this.id}-PrevPage">
          Previous Page
        </button>
      `;
    },

    nextPageButton() {
      if (!this.collection.hasNextPage) {
        return '';
      }

      return `
        <button class="igraweb-button" id="${this.id}-NextPage">
          Next Page
        </button>
      `;
    },

    // TODO: Try to rewrite all code so that it isn't so coupled. Think
    //       Data Down, Actions Up.
    build(node) {
      var _this = this;
      var form = new SearchForm(repository);

      form.onSuccess = function(collection) {
        if (_this.form.query) {
          _this.notice = `Showing search results for "${_this.form.query}"`;
        } else {
          _this.notice = '';
        }

        _this.updateCollection(collection);
      };

      form.pageSize = _this.pageSize;

      this.node = node;
      this.form = form;

      repository
        .findAll({ 'page[size]': _this.pageSize })
        .then(function(collection) {
          _this.updateCollection(collection);
          _this.bindButtonActions();
        });
    },

    bindButtonActions() {
      var _this = this;

      this.node.addEventListener('click', function(e) {
        var id = e.target.getAttribute('id');
        var promise;

        if (id === `${_this.id}-NextPage`) {
          promise = _this.collection.nextPage();
        } else if (id === `${_this.id}-PrevPage`) {
          promise = _this.collection.prevPage();
        } else {
          return true;
        }

        promise
          .then(function(collection) {
            _this.updateCollection(collection);
          })
          .catch(logError);

        e.preventDefault();
        return false;
      });
    },

    updateCollection(collection) {
      var formNode;

      this.collection = collection;
      this.node.innerHTML = this.template();
      formNode = this.node.querySelector(`#${this.id}-searchForm`);

      this.form.build(formNode);
    },
  });
};

export default Library;
