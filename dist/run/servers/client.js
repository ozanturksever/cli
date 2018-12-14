"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _web = _interopRequireDefault(require("./web"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Client UI server that simply serves the client directory and any
 * other files provided to the `serve` method.
 *
 * @param {Object} [options] - WebServer options
 */
class ClientServer extends _web.default {
  constructor(options) {
    super(options);
    this.serve('/', require('express').static(_path.default.join(__dirname, '../client')));
  }

}

exports.default = ClientServer;