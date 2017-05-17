/*jshint esversion: 6 */

import igraweb from '../index';

const { router } = igraweb.utils;

var insertAddSlotButton = function(node, template) {
  var button = document.createElement('button');

  button.innerText = "ADD SLOT";
  button.classList.add('igraweb-button');

  button.addEventListener('click', function() {
    appendSlotToTemplate(template);
  });
  
  node.insertAdjacentElement('afterend', button);
};

var appendSlotToTemplate = function(template) {
  var html = template.html;

  html += `\n<div data-igraweb-slot="slot-${Date.now()}-row"></div>\n`;

  template.update({ html }).then(function(template) {
    router.reload();
  });
};

igraweb.registerInitializer('addSlotToSectionTemplate', function() {
  // Add a button "ADD SLOT" below the data-igraweb-page
  //
  // When the button is clicked, append a data-igraweb-slot to the template
  // with a unique name (current time + something..)
  //
  // Then update the template.

  var pageNode = document.querySelector('[data-igraweb-page]');
  var uid = pageNode.getAttribute('data-igraweb-page');

  if (pageNode && uid) {
    igraweb.pages.find(uid).then(function(page) {
      if (page.isPersisted()) {
        igraweb.sections.find(uid).then(function fetchTemplate(section) {
          section.template().then(function (template) {
            insertAddSlotButton(pageNode, template);
          });
        });
      }
    });
  }
});

