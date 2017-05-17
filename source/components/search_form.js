/*jshint esversion: 6 */

import Errors from './errors';
import Utils from '../utils';

const { logError } = Utils;

var SearchForm = function(repository) {
  Object.assign(this, {
    pageSize: 8,

    query: '',

    template() {
      return `
        <div class="igraweb-flex-row igraweb-row-padding-md">
          <input id="search" type="search" name="filter[query]" placeholder="Search for ${repository.type}" value="${this.query || ''}">
          <button class="igraweb-button">Search</button>
        </div>
      `;
    },

    build(form) {
      this.form = form;
      form.innerHTML = this.template();
      this.bindSubmitAction();
    },

    bindSubmitAction() {
      var _this = this;
      var submitButton = this.form.querySelector('.igraweb-button');

      submitButton.addEventListener('click', function submitForm(e) {
        e.preventDefault();

        _this
          .submit()
          .then(_this.onSuccess, _this.onInvalid)
          .catch(_this.onError);

        return false;
      });
    },

    validate() {
      this.errors = new Errors();

      if (!this.form) {
        this.errors.add('form', 'There must be a form');
      }
    },

    toData() {
      var query = this.form['filter[query]'].value;
      var formData = {
        'page[size]': this.pageSize,
      };

      if (query) {
        formData['filter[query]'] = query;
        this.query = query;
      } else {
        this.query = null;
      }

      return formData;
    },

    /**
     * Default handler for successful form submission
     *
     * By default, a no-op
     *
     * @method onError
     * @public
     */
    onSuccess(resolvedWith) {
    },

    /**
     * Default handler for invalid form submission
     *
     * @method onInvalid
     * @public
     */
    onInvalid(errors) {
      console.log(errors);
    },

    /**
     * Default error handler
     *
     * @method onError
     * @public
     */
    onError(error) {
      logError(error);
    },

    submit() {
      var _this = this;

      return new Promise(function(resolve, reject) {
        var data;

        _this.validate();

        data = _this.toData();

        if (_this.errors.isAny()) {
          reject(_this.errors);
        }

        repository
          .findAll(data)
          .then(resolve, reject);
      });
    },
  });
};

export default SearchForm;

