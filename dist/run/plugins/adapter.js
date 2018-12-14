"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _base = _interopRequireDefault(require("./base"));

var _resolveLocal = _interopRequireDefault(require("../util/resolve-local"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  assign
} = Object;
/**
 * The adapter plugin is responsible for injecting an adapter and
 * other relevant code into the proxy and setting up adapter hooks for
 * the socket API.
 *
 * @param {String} options.name - The adapter name
 * @param {String} [options.module] - The adapter's module path
 * @param {Object} [options.inject] - Other modules to inject
 */

class AdapterPlugin extends _base.default {
  // default options for local adapters
  constructor(options) {
    let defaults = AdapterPlugin.defaults[options.name] || {};
    options = assign({}, defaults, options, {
      // if no path provided, try to resolve it from the name
      path: options.path || (0, _resolveLocal.default)('adapter', options.name),
      // deep assign injected defaults
      inject: assign({}, {
        head: [].concat(defaults.inject && defaults.inject.head, options.inject && options.inject.head).filter(Boolean),
        body: [].concat(defaults.inject && defaults.inject.body, options.inject && options.inject.body).filter(Boolean)
      })
    });
    super(options);
  }
  /**
   * Injects adapter scripts with initialization options including the
   * client URL and sets up the adapter socket API for updating the
   * store state.
   *
   * @param {ClientServer} client - Client server instance
   * @param {ProxyServer} proxy - Proxy server instance
   * @param {SocketServer} sockets - Socket API server instance
   * @param {Store} store - Coordinator state store
   */


  setup(client, proxy, sockets, store) {
    let {
      path,
      inject,
      ...options
    } = this.options; // stringify options needed by the adapter

    let opts = JSON.stringify(assign({}, options, {
      client: client.url
    })); // inject the adapter and supporting elements

    proxy.inject(assign({}, inject, {
      head: inject.head.concat([{
        script: '/adapter.js',
        serve: path
      }, {
        script: true,
        innerContent: `__bigtest__.default.init(${opts})`
      }])
    })); // define the adapter API

    sockets.on('adapter/connect', store.connectBrowser).on('adapter/disconnect', store.disconnectBrowser).on('adapter/start', store.startTests).on('adapter/update', store.updateTests).on('adapter/end', store.endTests);
  }

}

exports.default = AdapterPlugin;

_defineProperty(AdapterPlugin, "options", 'adapter');

_defineProperty(AdapterPlugin, "defaults", {
  mocha: {
    inject: {
      head: ['mocha/mocha.js']
    }
  }
});