"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function builder(yargs) {
  yargs.usage(_chalk.default`{green.bold Usage:} $0 run [options]`).option('network', {
    group: 'Options:',
    description: 'Generate @bigtest/mirage files for mocking the applications network',
    type: 'boolean',
    default: false
  }).option('app-framework', {
    group: 'Options:',
    description: 'Generate the BigTest framework-specific test helper file',
    type: 'string',
    default: 'react'
  });
}

async function handler(argv) {
  await require("./init").default(argv);
}

module.exports = {
  command: 'init',
  builder,
  handler
};