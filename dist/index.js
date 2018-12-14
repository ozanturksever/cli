"use strict";

var _yargonaut = _interopRequireDefault(require("yargonaut"));

var _yargs = _interopRequireDefault(require("yargs"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yargonaut.default.style('red.bold', ['Did you mean %s?']).style('blue', ['aliases:', 'default:', 'array', 'boolean', 'number', 'string']).style('green.bold', ['Commands:', 'Options:', 'Serve Options:', 'Adapter Options:', 'Client Options:', 'Proxy Options:']);

_yargs.default.scriptName('bigtest').usage(_chalk.default`{green.bold Usage:} $0 <command>`).version(require("../package.json").version).command(require("./init")).command(require("./run")).demandCommand(1, '').recommendCommands().fail((msg, err, yargs) => {
  if (!msg) {
    console.log(yargs.help());
    process.exit();
  } else if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.error(msg);
    process.exit(1);
  }
}).help().wrap(null).parse();