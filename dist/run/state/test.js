"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BrowserError = exports.FailingBrowserTest = exports.SkippedBrowserTest = exports.PassingBrowserTest = exports.RunningBrowserTest = exports.BrowserTest = void 0;

var _create = _interopRequireWildcard(require("./create"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  assign
} = Object;
/**
 * Represents the status of a test for a specific browser
 */

class BrowserTest {
  constructor() {
    _defineProperty(this, "browser", 'Unknown');
  }

  /**
   * Determines if we need to initialize as a specific BrowserTest
   * subclass instance.
   *
   * @param {Object} props - Properties passed to `create`
   * @returns {BrowserTest}
   */
  initialize(props) {
    return this.update(props);
  }
  /**
   * Conditionally transitions this instance into a different
   * BrowserTest subclass instance.
   *
   * @param {Object} props - Properties to transition with
   * @returns {BrowserTest}
   */


  update(props) {
    let pending = !(props.running || props.passing || props.failing || props.skipped);
    let extended = assign({}, this, props);

    if (!this.running && props.running) {
      return (0, _create.default)(RunningBrowserTest, extended);
    } else if (!this.passing && props.passing) {
      return (0, _create.default)(PassingBrowserTest, extended);
    } else if (!this.failing && props.failing) {
      return (0, _create.default)(FailingBrowserTest, extended);
    } else if (!this.skipped && props.skipped) {
      return (0, _create.default)(SkippedBrowserTest, extended);
    } else if (!this.pending && pending) {
      return (0, _create.default)(BrowserTest, extended);
    } else {
      return this;
    }
  }
  /**
   * True when a browser test is not in a running, passing, failing,
   * or skipped state.
   * @property {Boolean}
   */


  get pending() {
    return !(this.running || this.passing || this.failing || this.skipped);
  }
  /**
   * True when a browser test is not running, and is in a passing,
   * failing, or skipped state.
   * @property {Boolean}
   */


  get finished() {
    return !this.running && !!(this.passing || this.failing || this.skipped);
  }

}
/**
 * Reprisents a running browser test
 */


exports.BrowserTest = BrowserTest;

class RunningBrowserTest extends BrowserTest {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "running", true);
  }

}
/**
 * Reprisents a passing browser test
 */


exports.RunningBrowserTest = RunningBrowserTest;

class PassingBrowserTest extends BrowserTest {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "passing", true);

    _defineProperty(this, "duration", 0);
  }

}
/**
 * Reprisents a skipped browser test
 */


exports.PassingBrowserTest = PassingBrowserTest;

class SkippedBrowserTest extends BrowserTest {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "skipped", true);
  }

}
/**
 * Reprisents a skipped browser test
 */


exports.SkippedBrowserTest = SkippedBrowserTest;

class FailingBrowserTest extends BrowserTest {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "failing", true);

    _defineProperty(this, "duration", 0);

    _defineProperty(this, "errors", []);
  }

  /**
   * When initialized, errors are mapped into BrowserError instances
   *
   * @param {Object} props - Properties passed to `create`
   * @returns {FailingBrowserTest}
   */
  initialize(props) {
    if (props.errors && props.errors.length) {
      return this.set({
        errors: props.errors.map(err => {
          let {
            name,
            message,
            stack
          } = err;
          return (0, _create.default)(BrowserError, {
            browser: this.browser,
            name,
            message,
            stack
          });
        })
      });
    } else {
      return this;
    }
  }

}
/**
 * Represents an error encountered during a browser test
 */


exports.FailingBrowserTest = FailingBrowserTest;

class BrowserError {
  constructor() {
    _defineProperty(this, "name", 'Error');

    _defineProperty(this, "message", 'unknown error');

    _defineProperty(this, "browser", 'Unknown');

    _defineProperty(this, "stack", null);
  }

}
/**
 * Represents the state of a test in all browsers
 */


exports.BrowserError = BrowserError;

class Test {
  constructor() {
    _defineProperty(this, "name", '');

    _defineProperty(this, "path", []);

    _defineProperty(this, "all", []);
  }

  /**
   * The longest duration it took for the test to run in all browsers
   * @property {Number}
   */
  get duration() {
    return this.all.reduce((duration, test) => {
      return Math.max(duration, test.duration || 0);
    }, 0);
  }
  /**
   * True when all browsers' test are pending
   * @property {Boolean}
   */


  get pending() {
    return this.all.every(test => test.pending);
  }
  /**
   * True when all browsers' test are finished
   * @property {Boolean}
   */


  get finished() {
    return this.all.every(test => test.finished);
  }
  /**
   * True when some browsers' test are running
   * @property {Boolean}
   */


  get running() {
    return this.all.some(test => test.running);
  }
  /**
   * True when all browsers' test are passing
   * @property {Boolean}
   */


  get passing() {
    return this.all.every(test => test.passing);
  }
  /**
   * True when some browsers' test are failing
   * @property {Boolean}
   */


  get failing() {
    return this.all.some(test => test.failing);
  }
  /**
   * True when all browsers' test are skipped
   * @property {Boolean}
   */


  get skipped() {
    return this.all.every(test => test.skipped);
  }
  /**
   * Errors encountered by all browsers when failing
   * @property {BrowserError[]}
   */


  get errors() {
    return this.all.reduce((errors, test) => {
      return test.failing ? errors.concat(test.errors) : errors;
    }, []);
  }
  /**
   * Maybe initialize the test with a pre-existing browser
   *
   * @param {Object} props - Properties passed to `create`
   * @returns {Test}
   */


  initialize(props) {
    if (props.browser) {
      return this.update(props);
    } else {
      return this;
    }
  }
  /**
   * Updates or creates a new BrowserTest
   *
   * @param {Object} props - Properties for a BrowserTest
   * @returns {Test}
   */


  update(props) {
    let index = this.all.findIndex(test => {
      return test.browser === props.browser;
    });
    return this.set({
      all: (0, _create.update)(this.all, index, test => {
        return test ? test.update(props) : (0, _create.default)(BrowserTest, props);
      })
    });
  }

}

exports.default = Test;