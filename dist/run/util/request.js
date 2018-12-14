"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = request;

var _http = _interopRequireDefault(require("http"));

var _https = _interopRequireDefault(require("https"));

var _url = _interopRequireDefault(require("url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wraps node's http(s) `request` in a promise that resolves with the
 * `statusCode` and `body` of a response.
 *
 * @private
 * @param {String|Object} options - Options given to `http.request`
 * @returns {Promise} resolves when the response ends, rejects if the
 * request errors
 */
async function request(options) {
  let request = _http.default.request;

  if (typeof options === 'string') {
    options = _url.default.parse(options);
  }

  if (options.protocol === 'https:') {
    options = {
      rejectUnauthorized: false,
      ...options
    };
    request = _https.default.request;
  }

  return new Promise((resolve, reject) => {
    request(options, response => {
      let data = '';
      response.on('data', chunk => {
        data += chunk;
      });
      response.once('end', () => resolve({
        statusCode: response.statusCode,
        body: data
      }));
    }).on('error', reject).end();
  });
}