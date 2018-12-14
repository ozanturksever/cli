"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = require("fs-extra");

var _convergence = require("@bigtest/convergence");

var _process = _interopRequireDefault(require("../process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  assign
} = Object;
/**
 * A browser is a process that has it's own temporary directory, and
 * can open a target URL to run tests.
 *
 * @extends ChildProcess
 */

class BaseBrowser extends _process.default {
  /**
   * Unique ID used by the state when connecting launched browsers
   * @property {String}
   */
  // browsers are not given child process options
  constructor(options = {}) {
    var _temp;

    assign((_temp = super(), _defineProperty(this, "id", String(Math.floor(Math.random() * 10000)).padStart(4, '0')), _temp), {
      options
    });
  }
  /**
   * Absolute path to the user's home directory
   * @property {String}
   */


  get homedir() {
    return _os.default.homedir();
  }
  /**
   * Absolute path to this browser's personal temporary directory
   * @property {String}
   */


  get tmpdir() {
    let name = this.name.toLowerCase().replace(/\s/g, '-');
    return _path.default.join(_os.default.tmpdir(), `bigtest-${name}-${this.id}`);
  }
  /**
   * Writes content to a file within this browser's `tmpdir`
   *
   * @param {String} name - Name of the file, including extension
   * @param {String} content - File contents
   * @returns {Promise} resolves when the file is written
   */


  async writeFile(name, content) {
    await (0, _fsExtra.writeFile)(_path.default.join(this.tmpdir, name), content);
  }
  /**
   * Deletes and recreates this browser's temproary directory. If the
   * diractory does not yet exist, it will be created.
   *
   * @returns {Promise} resolves when the directory is (re)created
   */


  async cleanTmpDir() {
    await Promise.resolve().then(() => (0, _fsExtra.remove)(this.tmpdir)).then(() => (0, _fsExtra.mkdir)(this.tmpdir));
  }
  /**
   * Hook called when launching, after the temporary directory has
   * been cleaned. The browser process will not be launched until this
   * hook resolves.
   *
   * @returns {Promise} this method may be asynchronous
   */


  async setup() {}
  /**
   * Set's this instance's target, cleans the temporary directory,
   * calls the `setup` method, and launches the browser process.
   *
   * @param {String} url - The browser's target URL
   * @returns {Promise} resolves once the browser process is running
   * @throws {Error} when running the process encounters an issue
   */


  async launch(url) {
    let error;
    if (this.running) return;
    this.target = url || '';
    await this.cleanTmpDir();
    await this.setup(); // resolves when done running

    this.run().catch(err => {
      error = err;
    }); // wait until we start running, or encounter an error

    await (0, _convergence.when)(() => this.running || !!error && function (e) {
      throw e;
    }(error));
  }

}

exports.default = BaseBrowser;