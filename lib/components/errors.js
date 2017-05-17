/*jshint esversion: 6 */

var Errors = function() {
  var internalErrors = Object.create(null);

  Object.assign(this, {
    forEach() {
      return this.toArray().forEach(...arguments);
    },

    add(key, message, input) {
      internalErrors[key] = { message, input };
    },

    length() {
      return Object.keys(internalErrors).length;
    },

    isEmpty() {
      return this.length() === 0;
    },

    isAny() {
      return !this.isEmpty();
    },

    toArray() {
      return Object.keys(internalErrors).map(function(key) {
        var message = internalErrors[key].message;
        var input = internalErrors[key].input;
        return { name: key, message, input };
      });
    },
  });
};

export default Errors;
