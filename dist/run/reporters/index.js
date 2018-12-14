"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requireReporter = requireReporter;
exports.default = void 0;

var _resolveLocal = _interopRequireDefault(require("../util/resolve-local"));

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  assign
} = Object;
/**
 * Requires a local reporter's or module's default export and ensure's
 * it is an instance of the base reporter class.
 *
 * @private
 * @param {String} name - The local reporter name, or module path
 * @returns {Reporter} the resolved default reporter export
 * @throws {Error} when the reporter cannot be found, or if the default
 * export is not an instance of the base reporter class
 */

function requireReporter(name) {
  let Reporter;

  if (typeof name === 'string') {
    let module = (0, _resolveLocal.default)('reporter', name);
    Reporter = require(module).default;
  } else if (typeof name === 'function') {
    Reporter = name;
    name = Reporter.name;
  }

  if (!(Reporter && Reporter.prototype instanceof _base.default)) {
    throw new Error(`Invalid reporter "${name}"`);
  }

  return Reporter;
}
/**
 * Requires reporters and provides wrapper methods to invoke common
 * reporter methods.
 *
 * @private
 * @param {String[]} reporters - Reporters to require
 */


class ReporterManager {
  constructor(reporters, options = {}) {
    assign(this, {
      reporters: [].concat(reporters).map(module => {
        let Reporter = requireReporter(module);
        return new Reporter(options[Reporter.options]);
      })
    });
  }
  /**
   * Invokes the process method for all reporters
   *
   * @param {State} prev - The previous state instance
   * @param {State} next - The resulting state instance
   */


  process(prev, next) {
    for (let reporter of this.reporters) {
      reporter.process(prev, next);
    }
  }

}

exports.default = ReporterManager;