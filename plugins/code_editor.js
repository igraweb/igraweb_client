/*jshint esversion: 6 */

// TODO: This is a copy of text editor, the only difference is the query
//       selector. Refactor!

var getContent = function() {
  return this.value;
};

var codeEditor = function(container) {
  container.querySelectorAll('.igraweb-code-editor').forEach(function initEditor(node) {
    var editor = document.createElement('textarea');
    editor.innerHTML = node.innerHTML;
    editor.getContent = getContent;

    Array.from(node.attributes).forEach(function setAttributess(attrNode) {
      var attr = attrNode.nodeName;

      editor.setAttribute(attr, node.getAttribute(attr));
    });

    node.parentNode.replaceChild(editor, node);
  });
};

export default codeEditor;

