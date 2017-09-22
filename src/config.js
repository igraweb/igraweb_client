/*jshint esversion: 6 */

import textEditor from './plugins/text_editor';
import codeEditor from './plugins/code_editor';

/**
 * Shared config for the igraweb client.
 */
var config = {
  /**
   * The base path where the cms is mounted (shouldn't end in "/")
   *
   * @property mount
   * @required
   * @public
   */
  mount: '',

  /**
   * The URL or relative path to the igraweb API
   *
   * @property api
   * @required
   * @public
   */
  api: '/igraweb/',

  /**
   * The API site key for the igraweb API.
   *
   * @property api_site_key
   * @required
   * @public
   */
  api_site_key: 'enter-your-key',

  /**
   * Whether or not the test suite should be run on every request.
   *
   * @property runTests
   * @default true
   * @public
   */
  runTests: true,

  /**
   * An object of listeners. (See `igraweb.loadListeners` and
   * `igraweb.registerModelListener`)
   *
   * @property listeners
   * @default {}
   * @public
   */
  listeners: {},

  /**
   * TODO: Think about how this makes sense in relation to initializers and
   *       components as well.
   *
   * An object of plugins that can be called by name.
   *
   * @property plugins
   * @public
   */
  plugins: {
    textEditor,
    codeEditor,
  },

  /**
   * An object of routes that can be looked up by name
   *
   * This is where you can set the login, loginSuccess and notFound routes.
   *
   * @property routes
   * @public
   */
  routes: {
    login: '/login',
    loginSuccess: '/',
    notFound: '/',
  },

  /**
   * Default initializers to call when igraweb loads with an authenticated
   * user.
   *
   * @property initializers
   * @private
   */
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

  /**
   * Default components to be used by igraweb. (See
   * `igraweb.registerComponent`)
   *
   * @property components
   * @private
   */
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

  /**
   * A mapping of resources from singularized to pluralized.
   *
   * @property resources
   * @public
   */
  resources: {
    page: 'pages',
    section: 'sections',
    text: 'texts',
    embed: 'embeds',
    image: 'images',
    slot: 'slots',
  },

  /**
   * A list of inline resources. (See `igraweb.loadListeners`)
   *
   * @property inlineResources
   * @public
   */
  inlineResources: [],
};

export default config;
