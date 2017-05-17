/*jshint esversion: 6 */
var closeModal = function(e) {
  var modal = document.getElementById('igraweb-modal');

  if (!modal) {
    return true;
  }

  e.preventDefault();

  modal.parentNode.removeChild(modal);

  return false;
};

var closeOnEsc = function(e) {
  if (e.which === 27) {
    return closeModal(e);
  }

  return true;
};

var closeOnClickOutside = function(e) {
  if (e.which === 1 && e.target.classList.contains('igraweb-modal-container')) {
    return closeModal(e);
  }

  return true;
};

document.addEventListener('keydown', closeOnEsc);
document.addEventListener('mousedown', closeOnClickOutside);
