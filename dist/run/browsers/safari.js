"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SafariBrowser extends _base.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "name", 'Safari');
  }

  get command() {
    switch (process.platform) {
      case 'darwin':
        return [`${this.homedir}/Applications/Safari.app/Contents/MacOS/Safari`, '/Applications/Safari.app/Contents/MacOS/Safari'];

      default:
        throw new Error('Safari is not supported on this platform');
    }
  }

  get arguments() {
    return [`${this.tmpdir}/start.html`];
  }

  setup() {
    // safari interprets command line args as file paths, so we
    // open to an html file that will redirect to the target
    return this.writeFile('start.html', `<script>window.location="${this.target}"</script>`);
  }

}

exports.default = SafariBrowser;