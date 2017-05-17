/*jshint esversion: 6 */

import base from './base';
import content from './content';
import texts from '../repositories/texts';

function Text(json) {
  this.model_name = 'text';

  Object.assign(this, base);
  Object.assign(this, content);

  this.fromJson(json);

  this.repository = texts;

  Object.assign(this, {
    thumbnail() {
      var content = (this.content || "").slice(0, 40);
      var template = document.createElement('div');

      template.innerHTML = `
        <h6>
          ${this.name}
          <br>
          <small>${this.uid}</small>
        </h6>
        <div class="igraweb-thumbnail-content">
          <code></code>
        </div>
      `;

      template.querySelector('code').innerText = content;

      return template.outerHTML;
    },
  });
}

export default Text;
