/*jshint esversion: 6 */

import base from './base';
import sections from '../repositories/sections';
import slots from '../repositories/slots';

function Slot(json) {
  var section;

  this.model_name = 'slot';

  Object.assign(this, base);

  this.fromJson(json);

  this.repository = slots;

  this.destroy = undefined;
  this.update = function(relationships) {
    return this.repository.update(this.sectionUid, this, relationships);
  };

  section = this.relationships.section;

  if (section) {
    this.sectionUid = section.data.id;
    this.selector = `[data-igraweb-slot=${this.uid}][data-igraweb-section-id=${this.sectionUid}]`;
  }
}

export default Slot;

