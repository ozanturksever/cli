"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../../util/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  assign
} = Object;
/**
 * A plugin hooks into the coordinator and includes hooks used for
 * interacting with the different pieces that the coordinator is
 * responsible for.
 *
 * @param {Object} options - Plugin options
 */

class BasePlugin {
  /**
   * Key for options passed to a plugin from the plugin manager
   * @property {String}
   */

  /**
   * @constructor
   */
  constructor(options = {}) {
    assign(this, {
      log: _logger.default,
      options
    });
  }
  /**
   * The setup hook is invoked after the coordinator initializes all
   * of it's pieces. It is called with the client server, proxy
   * server, socket API server, and the state store instance.
   *
   * @param {ClientServer} client - Client server instance
   * @param {ProxyServer} proxy - Proxy server instance
   * @param {SocketServer} sockets - Socket API server instance
   * @param {Store} store - Coordinator state store
   */


  setup(client, proxy, sockets, store) {}
  /**
   * The start hook is invoked before the coordinator starts any other
   * pieces or launches browsers.
   *
   * @returns {Promise} should resolve after the plugin starts
   */


  async start() {}
  /**
   * The stop hook is invoked after the coordinator has closed
   * launched browsers and stopped all other pieces.
   *
   * @returns {Promise} should resolve after the plugin stops
   */


  async stop() {}

}

exports.default = BasePlugin;

_defineProperty(BasePlugin, "options", '');