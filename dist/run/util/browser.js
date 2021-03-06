"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultBrowser = getDefaultBrowser;
exports.parseBrowserName = parseBrowserName;

var _child_process = require("child_process");

/**
 * Uses the `x-defualt-browser` package return the common name of the
 * current user's default browser.
 *
 * @private
 * @returns {String} default browser name
 */
function getDefaultBrowser() {
  return (0, _child_process.spawnSync)('npx', ['x-default-browser']).stdout.toString().trim();
}
/**
 * Parses a user-agent string to determine the name and version a
 * browser reports itself as. If no match, "Unknown" is returned.
 *
 * @private
 * @param {String} ua - User-agent string
 * @returns {String} name and version of the browser
 */


function parseBrowserName(ua) {
  let re, m, browser, version;
  if (!ua) return 'Unknown';
  let regexps = {
    'Chrome': [/Chrome\/(\S+)/],
    'Firefox': [/Firefox\/(\S+)/],
    'MSIE': [/MSIE (\S+);/],
    'Opera': [/Opera\/.*?Version\/(\S+)/, /Opera\/(\S+)/],
    'Safari': [/Version\/(\S+).*?Safari\//]
  };

  for (browser in regexps) {
    while (re = regexps[browser].shift()) {
      if (m = ua.match(re)) {
        version = m[1].match(new RegExp('[^.]+(?:\\.[^.]+){0,1}'))[0];
        return browser + ' ' + version;
      }
    }
  }

  return 'Unknown';
}