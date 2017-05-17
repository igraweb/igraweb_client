/*jshint esversion: 6 */

import base from './base';
import content from './content';
import images from '../repositories/images';

function Image(json) {
  this.model_name = 'image';

  Object.assign(this, base);
  Object.assign(this, content);

  this.fromJson(json);

  this.repository = images;

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
            <img src="${this.content.thumb}">
          </div>
        </div>
      `;
    },
  });
}

export default Image;

