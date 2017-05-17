/*jshint esversion: 6 */

import base from './base';
import Embed from '../models/embed';

var embeds = Object.assign({}, base);

Object.assign(embeds, {
  model: Embed,
  type: 'embeds',
});

export default embeds;

