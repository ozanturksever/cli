"use strict";

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

var _yargsParser = _interopRequireDefault(require("yargs-parser"));

var _chalk = _interopRequireDefault(require("chalk"));

var _splitStringArgs = _interopRequireDefault(require("./util/split-string-args"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  assign
} = Object;

function builder(yargs) {
  yargs.usage(_chalk.default`{green.bold Usage:} $0 run [options]`).option('b', {
    group: 'Options:',
    alias: ['browser', 'browsers'],
    description: 'One or more browsers to launch',
    requiresArg: true,
    default: 'System Default',
    coerce: browsers => {
      return typeof browsers === 'string' ? browsers.split(',') : browsers;
    }
  }).option('r', {
    group: 'Options:',
    alias: ['reporter', 'reporters'],
    description: 'One or more reporters to use',
    requiresArg: true,
    default: 'dot',
    coerce: reporters => {
      return typeof reporters === 'string' ? reporters.split(',') : reporters;
    }
  }).option('v', {
    group: 'Options:',
    alias: ['verbose'],
    description: 'Show debug logs',
    type: 'boolean'
  }).option('plugins', {
    group: 'Options:',
    description: 'One or more plugins to use',
    requiresArg: true,
    coerce: plugins => {
      return typeof plugins === 'string' ? plugins.split(',') : plugins;
    }
  }).option('once', {
    group: 'Options:',
    description: 'Run once and exit',
    type: 'boolean'
  }).option('opts', {
    group: 'Options:',
    description: 'Path to options file',
    default: 'bigtest/bigtest.opts',
    config: true,
    configParser: filepath => {
      try {
        let opts = (0, _fs.readFileSync)(filepath).toString();
        return (0, _yargsParser.default)((0, _splitStringArgs.default)(opts));
      } catch (error) {
        let def = _path.default.resolve('bigtest/bigtest.opts');

        if (_path.default.resolve(filepath) !== def) throw error;
      }
    }
  }).option('client-hostname', {
    group: 'Client Options:',
    description: 'Client server host name',
    requiresArg: true,
    type: 'string',
    default: 'localhost'
  }).option('client-port', {
    group: 'Client Options:',
    description: 'Client server port number',
    requiresArg: true,
    type: 'number',
    default: 4567
  }).option('proxy-hostname', {
    group: 'Proxy Options:',
    description: 'Proxy server host name',
    requiresArg: true,
    type: 'string',
    default: 'localhost'
  }).option('proxy-port', {
    group: 'Proxy Options:',
    description: 'Proxy server port number',
    requiresArg: true,
    type: 'number',
    default: 5678
  }).option('s', {
    group: 'Serve Options:',
    alias: ['serve'],
    description: 'App server command',
    requiresArg: true,
    type: 'string'
  }).option('serve-url', {
    group: 'Serve Options:',
    description: 'App server URL',
    requiresArg: true,
    type: 'string',
    default: 'http://localhost:3000'
  }).option('serve-silent', {
    group: 'Serve Options:',
    description: 'Surpress app server output',
    type: 'boolean',
    default: false
  }).option('a', {
    group: 'Adapter Options:',
    alias: ['adapter'],
    description: 'Adapter name',
    requiresArg: true,
    type: 'string'
  }).option('adapter-path', {
    group: 'Adapter Options:',
    description: 'Adapter path to serve',
    requiresArg: true,
    type: 'string'
  });
}

function handler(argv) {
  let Coordinator = require("./coordinator").default; // Options:


  let c = new Coordinator(assign({}, argv, {
    //   -b, --browser, --browsers  string[]
    browsers: [].concat(argv.browsers).filter(Boolean),
    //   -r, --reporter, --reporters  string[]
    reporters: [].concat(argv.reporters).filter(Boolean),
    //   -v, --verbose  boolean
    verbose: !!argv.verbose,
    //   --once  boolean
    once: !!argv.once,
    // Client Options:
    client: argv.client || {
      //   --client-hostname  string
      hostname: argv.clientHostname,
      //   --client-port  string
      port: argv.clientPort
    },
    // Proxy Options:
    proxy: argv.proxy || {
      //   --proxy-hostname  string
      hostname: argv.proxyHostname,
      //   --proxy-port  string
      port: argv.proxyPort
    },
    // Plugin Options:
    //   --plugins  string[]
    plugins: [].concat(argv.plugins).filter(Boolean),
    //   -s, --serve  string
    serve: !!argv.serve && {
      //   --serve-exec  string
      exec: argv.serve,
      //   --serve-url  string
      url: argv.serveUrl,
      //   --serve-silent
      silent: !!argv.serveSilent
    },
    //   -a, --adapter  string
    adapter: !!(argv.adapter || argv.adapterPath) && {
      //   --adapter-name  string
      name: argv.adapter,
      //   --adapter-path  string
      path: argv.adapterPath
    },
    exit: process.exit
  }));
  process.on('SIGINT', () => c.stop());
  c.start();
}

module.exports = {
  command: 'run',
  aliases: ['r'],
  builder,
  handler
};