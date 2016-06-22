import expect from 'expect'
import fs from 'fs'
import path from 'path'
import {spawn} from 'child_process'

const bin = path.resolve(__dirname, '../dist/static-build.js')
const src = path.resolve(__dirname, 'sample/src/')
const dist = path.resolve(__dirname, 'sample/dist/')
const encoding = 'utf-8'

describe('use cli static-build should work', () => {
  let indexHtml, helloHtml, indexCss, indexJs, indexCssfile, indexJsfile
  let cssfileList, assetfileList, jsfileList
  before((done) => {
    const cli = spawn(bin, ['-s', src, '-d', dist], {stdio: 'inherit'})
    cli.on('exit', (code, signal) => {
      cssfileList = fs.readdirSync(dist + '/styles')
      assetfileList = fs.readdirSync(dist + '/assets')
      jsfileList = fs.readdirSync(dist + '/scripts')
      helloHtml = fs.readFileSync(dist + '/hello.html', {encoding})
      indexHtml = fs.readFileSync(dist + '/index.html', {encoding})
      indexCssfile = fs.readdirSync(dist + '/styles').filter(name => /index-\w+\.css/.test(name))[0]
      indexJsfile = fs.readdirSync(dist + '/scripts').filter(name => /index-\w+\.js/.test(name))[0]
      indexCss = fs.readFileSync(dist + '/styles/' + indexCssfile, {encoding})
      indexJs = fs.readFileSync(dist + '/scripts/' + indexJsfile, {encoding})
      done()
    })
  })

  it('destination assets should have revision hash', () => {
    const isCssRevisioned = cssfileList.some(name => /abc-\w+\.css/.test(name))
    const isAssetRevisioned = assetfileList.some(name => /ad-\w+\.png/.test(name))
    const isJsRevisioned = jsfileList.some(name => /hello-\w+\.js/.test(name))
    expect(true).toBe(isAssetRevisioned).toBe(isCssRevisioned).toBe(isJsRevisioned)
  })

  it('destination html inner resource url should be replaced with revisioned ones', () => {
    expect(helloHtml)
      .toMatch(/src=scripts\/hello-\w+\.js/)
      .toMatch(/href=styles\/hello-\w+\.css/)
      .toMatch(/src=\.\/assets\/ad-\w+\.png/)
  })

  it('destination css inner resource url should be replaced with revisioned ones', () => {
    expect(indexCss).toMatch(/url\(\.\.\/assets\/ad-\w+\.png\)/)
  })

  it('destination html, js, css should minified', () => {
    expect(indexHtml).toNotMatch(/>\s+</)
    expect(indexCss).toNotMatch(/\{\s+\w/)
    expect(indexJs).toNotMatch(/\{\s+\w/)
  })
})
