"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ChromeBrowser extends _base.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "name", 'Google Chrome');
  }

  get command() {
    switch (process.platform) {
      case 'linux':
        return ['google-chrome', 'google-chrome-stable'];

      case 'darwin':
        return [`${this.homedir}/Applications/${this.name}.app/Contents/MacOS/${this.name}`, `/Applications/${this.name}.app/Contents/MacOS/${this.name}`];

      case 'win32':
        return [`${this.homedir}\\Local Settings\\Application Data\\Google\\${this.name}\\Application\\chrome.exe`, `${this.homedir}\\AppData\\Local\\Google\\${this.name}\\Application\\chrome.exe`, `C:\\Program Files\\Google\\${this.name}\\Application\\Chrome.exe`, `C:\\Program Files (x86)\\Google\\${this.name}\\Application\\Chrome.exe`];
    }
  }

  get arguments() {
    return [`--user-data-dir=${this.tmpdir}`, '--no-default-browser-check', '--no-first-run', '--disable-default-apps', '--disable-popup-blocking', '--disable-translate', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-device-discovery-notifications', this.target];
  }

}

exports.default = ChromeBrowser;