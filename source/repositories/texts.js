/*jshint esversion: 6 */

import base from './base';
import Text from '../models/text';

var texts = Object.assign({}, base);

Object.assign(texts, {
  model: Text,
  type: 'texts',
});

export default texts;

