#!/usr/bin/env node

import yargs from 'yargs'
import path from 'path'
import {spawn} from 'child_process'

const gulpfile = path.resolve(__dirname, 'gulpfile.js')
const gulpbin = path.resolve(__dirname, '../node_modules/.bin/gulp')
const projectRoot = path.resolve(__dirname, '..')

let {src, dist, dev} = yargs
  .usage('Usage: $0 [options]')
  .demand('src')
  .alias('s', 'src')
  .describe('src', 'the source file directory')
  .alias('d' , 'dist')
  .describe('dist', 'the distination directory to be built into')
  .describe('dev', 'watch the changes and start a server for developing')
  .example('$0 -s .', 'use files in current directory to build')
  .argv

if(!dist) {
  dist = path.resolve(src, './dist')
}

process.env.STATIC_BUILD_SRC = src = path.resolve(src)
process.env.STATIC_BUILD_DIST = path.resolve(dist)

spawn(gulpbin, ['--gulpfile', gulpfile, '--cwd', src, dev ? 'dev' : 'default'], {stdio: 'inherit'})
