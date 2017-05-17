/*jshint esversion: 6 */

import config from '../config';

import rest from '../utils/rest';
import currentUser from '../utils/current_user';
import router from '../router';

const Modal = config.components.Modal;

var LoginModal = function() {
  Object.assign(this, {
    init() {
      var modal = Modal();
      var formNode;

      modal.title = "<h2>Login to Igraweb</h2>";
      modal.body = `
        <form class="igraweb-form">
          <label for="igraweb-accessKey">Access Key</label>
          <input id="igraweb-accessKey" type="text" placeholder="Access Key" name="access_key">
          <label for="igraweb-secretKey">Secret Key</label>
          <input id="igraweb-secretKey" type="password" placeholder="Secret Key" name="secret_key">
        </form>
      `;

      modal.action("LOGIN", function submitForm(modal) {
        var form = modal.node.querySelector('form');

        var accessKey = form.access_key.value;
        var secretKey = form.secret_key.value;

        currentUser.logout();

        currentUser
          .authenticate(accessKey, secretKey)
          .then(function redirect() {
            if (router.isAt('login')) {
              router.redirect('loginSuccess');
            }
          })
          .catch(function(error) {
            modal.remove();
            router.reload();
          });
      });

      modal.build();

      formNode = modal.node.querySelector('form');

      formNode.addEventListener('keydown', function submitFormOnEnter(e) {
        if (e.which === 13) {
          modal.actions.LOGIN(modal);
        }
      });
    },
  });
};

export default LoginModal;
