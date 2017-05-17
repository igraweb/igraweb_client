/*jshint esversion: 6 */

import base from './base';
import content from './content';
import templates from '../repositories/templates';

function Template(json) {
  this.model_name = 'template';

  Object.assign(this, base);
  Object.assign(this, content);

  this.fromJson(json);

  this.repository = templates;
}

export default Template;


