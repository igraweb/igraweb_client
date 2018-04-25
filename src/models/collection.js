/*jshint esversion: 6 */

// TODO: Where is the best place to put this code???

var enumerableMethods = [
  'forEach',
  'find',
  'map',
];

var Collection = function(links, models, repository) {
  var object = Object.create({}, {
    constructor: { value: Collection }
  });

  enumerableMethods.forEach(function delegateMethod(method) {
    object[method] = function() {
      return models[method](...arguments);
    };
  });

  Object.assign(object, {
    toArray() {
      return models.slice(0);
    },

    nextPage() {
      var _this = this;

      return new Promise(function(resolve, reject) {
        if (!_this.hasNextPage) {
          throw new Error('No next page link for collection');
        }

        repository.paginate(links.next).then(resolve, reject);
      });
    },

    prevPage() {
      var _this = this;

      return new Promise(function(resolve, reject) {
        if (!_this.hasPrevPage) {
          throw new Error('No previous page link for collection');
        }

        repository.paginate(links.prev).then(resolve, reject);
      });
    },

    hasNextPage: !!links.next,

    hasPrevPage: !!links.prev,
  });

  return object;
};

export default Collection;
