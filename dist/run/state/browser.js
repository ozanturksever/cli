"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FinishedBrowserSocket = exports.RunningBrowserSocket = exports.BrowserSocket = void 0;

var _create = _interopRequireWildcard(require("./create"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Represents a connected websocket from a browser
 */
class BrowserSocket {
  constructor() {
    _defineProperty(this, "id", '');
  }

  /**
   * True when the socket is not running or finished
   * @property {Boolean}
   */
  get waiting() {
    return !(this.running || this.finished);
  }
  /**
   * Maybe transitions into a RunningBrowserSocket subclass instance
   *
   * @returns {BrowserSocket}
   */


  run() {
    if (!this.running) {
      return (0, _create.default)(RunningBrowserSocket, this);
    } else {
      return this;
    }
  }

}

exports.BrowserSocket = BrowserSocket;

class RunningBrowserSocket extends BrowserSocket {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "running", true);
  }

  /**
   * Maybe transitions into a RunningBrowserSocket subclass instance
   *
   * @returns {BrowserSocket}
   */
  done() {
    return (0, _create.default)(FinishedBrowserSocket, this);
  }

}

exports.RunningBrowserSocket = RunningBrowserSocket;

class FinishedBrowserSocket extends BrowserSocket {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "finished", true);
  }

}

exports.FinishedBrowserSocket = FinishedBrowserSocket;

class Browser {
  constructor() {
    _defineProperty(this, "id", '');

    _defineProperty(this, "name", 'Unknown');

    _defineProperty(this, "launched", false);

    _defineProperty(this, "sockets", []);
  }

  /**
   * True when there are connected websockets
   * @property {Boolean}
   */
  get connected() {
    return this.sockets.length > 0;
  }
  /**
   * True when some connected websockets are waiting
   * @property {Boolean}
   */


  get waiting() {
    return this.connected && this.sockets.some(socket => socket.waiting);
  }
  /**
   * True when some connected websockets are running
   * @property {Boolean}
   */


  get running() {
    return this.connected && this.sockets.some(socket => socket.running);
  }
  /**
   * True when all connected websockets are finished
   * @property {Boolean}
   */


  get finished() {
    return this.connected && this.sockets.every(socket => socket.finished);
  }
  /**
   * Adds a BrowserSocket instance when a new websocket connects
   *
   * @param {String} sid - Socket ID
   * @returns {Browser}
   */


  connect(sid) {
    let index = this.sockets.findIndex(socket => {
      return socket.id === sid;
    });

    if (index === -1) {
      return this.set({
        sockets: this.sockets.concat((0, _create.default)(BrowserSocket, {
          id: sid
        }))
      });
    } else {
      return this;
    }
  }
  /**
   * Removes a BrowserSocket instance when a websocket disconnects
   *
   * @param {String} sid - Socket ID
   * @returns {Browser}
   */


  disconnect(sid) {
    let index = this.sockets.findIndex(socket => {
      return socket.id === sid;
    });

    if (index > -1) {
      return this.set({
        sockets: (0, _create.update)(this.sockets, index, null)
      });
    } else {
      return this;
    }
  }
  /**
   * Transitions a connected BrowserSocket instance into a
   * RunningBrowserSocket instance.
   *
   * @param {String} sid - Socket ID
   * @returns {Browser}
   */


  run(sid) {
    let index = this.sockets.findIndex(socket => {
      return socket.id === sid;
    });

    if (index > -1) {
      return this.set({
        sockets: (0, _create.update)(this.sockets, index, socket => {
          return socket.run();
        })
      });
    } else {
      return this;
    }
  }
  /**
   * Transitions a connected RunningBrowserSocket instance into a
   * FinishedBrowserSocket instance.
   *
   * @param {String} sid - Socket ID
   * @returns {Browser}
   */


  done(sid) {
    let index = this.sockets.findIndex(socket => {
      return socket.id === sid;
    });

    if (index > -1) {
      return this.set({
        sockets: (0, _create.update)(this.sockets, index, socket => {
          return socket.done();
        })
      });
    } else {
      return this;
    }
  }

}

exports.default = Browser;