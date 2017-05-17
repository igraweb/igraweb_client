/*jshint esversion: 6 */

import base from './base';
import content from './content';
import slots from '../repositories/slots';
import sections from '../repositories/sections';
import templates from '../repositories/templates';

function Section(json) {
  this.model_name = 'section';

  Object.assign(this, base);
  Object.assign(this, content);

  this.fromJson(json);

  this.repository = sections;

  Object.assign(this, {
    fetchSlot(slotUid) {
      return slots.find(this.uid, slotUid);
    },

    template() {
      var template = this.relationships.template;

      return new Promise(function(resolve, reject) {
        if (!template) {
          reject();
        }

        templates.find(template.data.id).then(resolve);
      });
    },
  });
}

export default Section;
