/*jshint esversion: 6 */

import base from './base';
import content from './content';
import embeds from '../repositories/embeds';

function Embed(json) {
  this.model_name = 'embed';

  Object.assign(this, base);
  Object.assign(this, content);

  this.fromJson(json);

  this.repository = embeds;

  Object.assign(this, {
    thumbnail() {
      return `
        <div>
          <h6>
            ${this.name}
            <br>
            <small>${this.uid}</small>
          </h6>
          <div class="igraweb-thumbnail-content">
            ${this.content}
          </div>
        </div>
      `;
    },
  });
}

export default Embed;

