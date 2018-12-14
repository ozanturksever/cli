"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _fsExtra = require("fs-extra");

var _logger = _interopRequireDefault(require("../util/logger"));

var _cleanUpFiles = _interopRequireDefault(require("./utils/clean-up-files"));

var _copyWith = require("./utils/copy-with");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CWD = process.cwd();
const BIGTEST_DIR = `${CWD}/bigtest`;

async function init({
  network,
  appFramework
} = {}) {
  let bigtestDirExists = (0, _fsExtra.existsSync)(BIGTEST_DIR);
  let networkDirExists = (0, _fsExtra.existsSync)(`${BIGTEST_DIR}/network`);
  let isCreatingNetwork = !networkDirExists && network;

  if (bigtestDirExists && !isCreatingNetwork) {
    _logger.default.info('Looks like BigTest is already initialized');

    return;
  }

  if (bigtestDirExists && isCreatingNetwork) {
    await (0, _copyWith.copyNetwork)(CWD, appFramework);

    _logger.default.info('@bigtest/network has been initialized');

    return;
  }

  try {
    let {
      needsNetwork
    } = await (0, _copyWith.copyWithFramework)(CWD, appFramework, network);
    let networkMessage = needsNetwork ? 'and @bigtest/mirage' : '';

    _logger.default.info(`BigTest has been initialized with @bigtest/${appFramework} ${networkMessage}`);
  } catch (error) {
    _logger.default.error('Initialize failed :(');

    _logger.default.error(error);

    await (0, _cleanUpFiles.default)('bigtest', CWD);
  }
}