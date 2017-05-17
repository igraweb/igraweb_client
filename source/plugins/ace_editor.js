/*jshint esversion: 6 */

import ace from 'brace';

require('brace/mode/html');
require('brace/theme/monokai');

var aceEditor = function(container) {
  container.querySelectorAll('.igraweb-code-editor').forEach(function initEditor(node) {
    var id = node.getAttribute('id') || `igraweb-ace-editor-${Date.now()}`;
    var content = node.innerHTML;
    var editor;

    node.setAttribute('id', id);

    editor = ace.edit(id);
    editor.getSession().setMode('ace/mode/html');
    editor.setTheme('ace/theme/monokai');
    editor.setValue(content);

    node.getContent = function() {
      return editor.getValue();
    };
  });
};

export default aceEditor;

