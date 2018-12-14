"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requirePlugin = requirePlugin;
exports.default = void 0;

var _resolveLocal = _interopRequireDefault(require("../util/resolve-local"));

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  assign
} = Object;
/**
 * Requires a local plugin's or module's default export and ensure's
 * it is an instance of the base plugin class.
 *
 * @private
 * @param {String|Plugin} name - The local plugin name, or module path
 * @returns {Plugin} the resolved default plugin export
 * @throws {Error} when the plugin cannot be found, or if the default
 * export is not an instance of the base plugin class
 */

function requirePlugin(name) {
  let Plugin;

  if (typeof name === 'string') {
    let module = (0, _resolveLocal.default)('plugin', name);
    Plugin = require(module).default;
  } else if (typeof name === 'function') {
    Plugin = name;
    name = Plugin.name;
  }

  if (!(Plugin && Plugin.prototype instanceof _base.default)) {
    throw new Error(`Invalid plugin "${name}"`);
  }

  return Plugin;
}
/**
 * Requires plugins and provides wrapper methods to invoke hooks for
 * all plugins.
 *
 * Plugin options are picked from provided options using the plugin's
 * name as the option key. If any `adapter` or `serve` options are
 * provided, those plugins are automatically loaded.
 *
 * @private
 * @param {String[]} plugins - Plugins to require
 * @param {Object} options - All possible plugin options
 */


class PluginManager {
  constructor(plugins, options = {}) {
    // automatically include the adapter plugin
    if (options.adapter && plugins.indexOf('adapter') === -1) {
      plugins = ['adapter', ...plugins];
    } // automatically include the serve plugin


    if (options.serve && plugins.indexOf('serve') === -1) {
      plugins = ['serve', ...plugins];
    } // require and initialize plugins


    assign(this, {
      plugins: plugins.map(plugin => {
        let Plugin = requirePlugin(plugin);
        return new Plugin(options[Plugin.options]);
      })
    });
  }
  /**
   * Invokes the `setup` hook for all plugins
   *
   * @param {ClientServer} client - Client server instance
   * @param {ProxyServer} proxy - Proxy server instance
   * @param {SocketServer} sockets - Socket API server instance
   * @param {Store} store - Coordinator state store
   */


  setup(client, proxy, sockets, store) {
    for (let plugin of this.plugins) {
      plugin.setup(client, proxy, sockets, store);
    }
  }
  /**
   * Invokes the async `start` hook for all plugins
   *
   * @returns {Promise} resolves when all plugins have started
   */


  async start() {
    await Promise.all(this.plugins.map(plugin => plugin.start()));
  }
  /**
   * Invokes the async `stop` hook for all plugins
   *
   * @returns {Promise} resolves when all plugins have stopped
   */


  async stop() {
    await Promise.all(this.plugins.map(plugin => plugin.stop()));
  }

}

exports.default = PluginManager;