/*jshint esversion: 6 */

require('jsdom-global')();

const {expect} = require('chai');

const Utils = require('../dist/utils').default;

describe('Utils', () => {
  describe('flattenQueryObject', () => {
    it('works with nested objects', () => {
      const query = { page: { size: 1 } };

      expect(Utils.flattenQueryObject(query)).to.deep.equal({ 'page[size]': 1 });
    });

    it('works with deeper nested objects', () => {
      const query = { page: { size: { factor: { gradient: 1 } } } };

      expect(Utils.flattenQueryObject(query)).to.deep.equal(
        { 'page[size][factor][gradient]': 1 }
      );
    });

    it('works with keys nested at different levels', () => {
      const query = {
        page: {
          size: {
            factor: { gradient: 1, other: 2 },
            other: 2
          }
        }
      };

      expect(Utils.flattenQueryObject(query)).to.deep.equal(
        {
          'page[size][factor][gradient]': 1,
          'page[size][factor][other]': 2,
          'page[size][other]': 2,
        }
      );
    });
  });
});
