/*jshint esversion: 6 */

import base from './base';
import Section from '../models/section';

var sections = Object.assign({}, base);

Object.assign(sections, {
  model: Section,
  type: 'sections',
});

export default sections;
