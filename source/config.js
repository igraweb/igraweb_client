/*jshint esversion: 6 */

import textEditor from './plugins/text_editor';
import codeEditor from './plugins/code_editor';

var config = {
  api: '/igraweb/',

  api_site_key: 'enter-your-key',

  runTests: true,

  listeners: {},

  // TODO: Think about how this makes sense in relation to initializers and
  //       components as well.
  plugins: {
    textEditor,
    codeEditor,
  },

  routes: {
    login: '/login',
    loginSuccess: '/',
    notFound: '/',
  },

  initializers: {
    modal() {
      require('./initializers/modal');
    },
    embed() {
      require('./initializers/embed');
    },
    text() {
      require('./initializers/text');
    },
    image() {
      require('./initializers/image');
    },
    slot() {
      require('./initializers/slot');
    },
    section() {
      require('./initializers/section');
    },
  },

  components: {
    ImageForm() {
      var ImageForm = require('./components/image_form').default;

      return new ImageForm(...arguments);
    },
    TextForm() {
      var TextForm = require('./components/text_form').default;

      return new TextForm(...arguments);
    },
    EmbedForm() {
      var EmbedForm = require('./components/embed_form').default;

      return new EmbedForm(...arguments);
    },
    SectionForm() {
      var SectionForm = require('./components/section_form').default;

      return new SectionForm(...arguments);
    },
    PageForm() {
      var PageForm = require('./components/page_form').default;

      return new PageForm(...arguments);
    },
    TemplateForm() {
      var TemplateForm = require('./components/template_form').default;

      return new TemplateForm(...arguments);
    },
    Aside() {
      var Aside = require('./components/aside').default;

      return new Aside(...arguments);
    },
    Modal() {
      var Modal = require('./components/modal').default;

      return new Modal(...arguments);
    },
    Tooltip() {
      var Tooltip = require('./components/tooltip').default;

      return new Tooltip(...arguments);
    },
    LoginModal() {
      var LoginModal = require('./components/login_modal').default;

      return new LoginModal(...arguments);
    },
    Library() {
      var Library = require('./components/library').default;

      return new Library(...arguments);
    },
    Errors() {
      var Errors = require('./components/errors').default;

      return new Errors(...arguments);
    },
  },
};

export default config;
