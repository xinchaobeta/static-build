#!/usr/bin/env node
'use strict';

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const gulpfile = _path2.default.resolve(__dirname, 'gulpfile.js');
const gulpbin = _path2.default.resolve(__dirname, '../node_modules/.bin/gulp');
const projectRoot = _path2.default.resolve(__dirname, '..');

var _yargs$usage$demand$a = _yargs2.default.usage('Usage: $0 [options]').demand('src').alias('s', 'src').describe('src', 'the source file directory').alias('d', 'dist').describe('dist', 'the distination directory to be built into').describe('dev', 'watch the changes and start a server for developing').example('$0 -s .', 'use files in current directory to build').argv;

let src = _yargs$usage$demand$a.src;
let dist = _yargs$usage$demand$a.dist;
let dev = _yargs$usage$demand$a.dev;


if (!dist) {
  dist = _path2.default.resolve(src, './dist');
}

process.env.STATIC_BUILD_SRC = src = _path2.default.resolve(src);
process.env.STATIC_BUILD_DIST = _path2.default.resolve(dist);

(0, _child_process.spawn)(gulpbin, ['--gulpfile', gulpfile, '--cwd', src, dev ? 'dev' : 'default'], { stdio: 'inherit' });