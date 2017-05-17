/*jshint esversion: 6 */

import base from './base';
import Template from '../models/template';

var templates = Object.assign({}, base);

Object.assign(templates, {
  model: Template,
  type: 'templates',
});

export default templates;


