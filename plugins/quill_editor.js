/*jshint esversion: 6 */

require('quill/dist/quill.snow.css');

import Quill from 'quill';

var quillEditor = function(container) {
  container.querySelectorAll('.igraweb-text-editor').forEach(function initEditor(node) {
    var quill = new Quill(node, {
      theme: 'snow',
    });

    node.getContent = function() {
      return quill.root.innerHTML;
    };
  });
};

export default quillEditor;
