"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveLocal;

var _path = _interopRequireDefault(require("path"));

var _fsExtra = require("fs-extra");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks for the a file in a local directory within this package
 * (browsers, adapters, reporters). If it doesn't exist locally,
 * attempt to resolve the absolute path using `require.resolve`.
 *
 * @private
 * @param {String} dir - Local directory to look in
 * @param {String} name - Name of local file, or module path
 * @returns {String} the module path, or null if not found
 */
function resolveLocal(type, name) {
  // locally, the directory is the pluralized type
  let local = _path.default.join(__dirname, `../${type}s/${name}.js`);

  let module = (0, _fsExtra.existsSync)(local) ? local : null; // if not local, try to resolve the name directly

  try {
    module = module || require.resolve(name);
  } catch (e) {} // throw our own error when the module cannot be found


  if (!module) throw new Error(`Cannot find ${type} "${name}"`); // return the module path

  return module;
}