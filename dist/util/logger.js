"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = require("winston");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const colors = {
  info: 'blue',
  warn: 'yellow',
  error: 'red'
};
const logger = (0, _winston.createLogger)({
  // instead of combining multiple, custom, formats just do them all
  // in a single custom formatter
  format: _winston.format.printf(info => {
    let {
      level,
      message
    } = info;
    let prefix = ''; // when logging non-default levels, add a colored level prefix

    if (logger.level !== 'info' || level !== 'info') {
      if (colors[level]) {
        prefix += _chalk.default[colors[level]](level) + ' ';
      } else {
        prefix += _chalk.default.gray(level) + ' ';
      }
    } // make code blocks green


    if (message.indexOf('`') > -1) {
      message = message.replace(/`.*?`/g, _chalk.default.green('$&'));
    }

    return _chalk.default`${prefix}{white ${message}}`;
  }),
  transports: [new _winston.transports.Console()]
});
var _default = logger;
exports.default = _default;