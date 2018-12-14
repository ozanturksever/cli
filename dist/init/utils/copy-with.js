"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyNetwork = copyNetwork;
exports.copyWithFramework = copyWithFramework;

var _path = require("path");

var _fsExtra = require("fs-extra");

const CLI_TEMPLATE_DIR = (0, _path.join)(__dirname, '../../../templates');

async function copyNetwork(CWD, framework) {
  await (0, _fsExtra.copy)(`${CLI_TEMPLATE_DIR}/network`, `${CWD}/bigtest/network`);
  await (0, _fsExtra.copy)(`${CLI_TEMPLATE_DIR}/helpers/${framework}-network`, `${CWD}/bigtest/helpers`);
  return true;
}

async function copyWithFramework(CWD, framework, needsNetwork) {
  await (0, _fsExtra.copy)(`${CLI_TEMPLATE_DIR}/bigtest`, `${CWD}/bigtest`);
  await (0, _fsExtra.copy)(`${CLI_TEMPLATE_DIR}/helpers/${framework}`, `${CWD}/bigtest/helpers`);

  if (needsNetwork) {
    await copyNetwork(CWD, framework);
  }

  return {
    needsNetwork
  };
}