"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = binExists;

var _child_process = require("child_process");

/**
 * Uses `which` in a child process to determin if a bin exists
 *
 * @param {String} bin - Executable bin name
 * @returns {Boolean} true when the bin exists
 */
function binExists(bin) {
  let results = (0, _child_process.spawnSync)('which', [bin]);
  return results.status === 0;
}