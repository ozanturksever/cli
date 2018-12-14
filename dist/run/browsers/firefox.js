"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FirefoxBrowser extends _base.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "name", 'Firefox');
  }

  get command() {
    switch (process.platform) {
      case 'linux':
        return 'firefox';

      case 'darwin':
        return [`${this.homedir}/Applications/Firefox.app/Contents/MacOS/firefox`, '/Applications/Firefox.app/Contents/MacOS/firefox'];

      case 'win32':
        return ['C:\\Program Files\\Mozilla Firefox\\firefox.exe', 'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe'];
    }
  }

  get arguments() {
    return ['-profile', this.tmpdir, this.target];
  }

  setup() {
    // using user.js to suppress checks and popups
    return this.writeFile('user.js', ['user_pref("browser.shell.checkDefaultBrowser", false);', 'user_pref("browser.cache.disk.smart_size.first_run", false);', 'user_pref("datareporting.policy.dataSubmissionEnabled", false);'].join('\n'));
  }

}

exports.default = FirefoxBrowser;