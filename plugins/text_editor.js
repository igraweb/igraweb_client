/*jshint esversion: 6 */

var getContent = function() {
  return this.value;
};

var textEditor = function(container) {
  container.querySelectorAll('.igraweb-text-editor').forEach(function initEditor(node) {
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

export default textEditor;
