"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fsExtra = require("fs-extra");

async function cleanupFiles(path, cwd) {
  try {
    await (0, _fsExtra.remove)(`${cwd}/${path}`);
  } catch (error) {
    console.log(`Could not clean up files. ${error}`);
  }
}

var _default = cleanupFiles;
exports.default = _default;