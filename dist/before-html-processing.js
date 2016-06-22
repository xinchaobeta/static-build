'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const REGEX_SCRIPT = /(<head>[\s\S]*?)(<script\b[\s\S]*?<\/head>)/;
const REGEX_HEAD = /<\/head>/;
const REGEX_STYLE = /<head>/;
const script = `
  <script>
  document.documentElement.style.fontSize = 100 * innerWidth / 750 + 'px'
  addEventListener('load', function() {
    setTimeout(function(){
       document.documentElement.style.fontSize = 100 * innerWidth / 750 + 'px'
       window.unit = 100 * innerWidth / 750;
       var e = document.createEvent('Event');
       e.initEvent('adjustReady', true, true);
       window.dispatchEvent(e);
    }, 480);
  })
  addEventListener('orientationchange', function() {
      setTimeout(function(){
        document.documentElement.style.fontSize = 100 * innerWidth / 750 + 'px'
      }, 480)

  });
  </script>
`;
const style = `<style> body { font-size: .16rem; } </style>`;

const insertScript = (source, script) => {
  switch (true) {
    case REGEX_SCRIPT.test(source):
      return source.replace(REGEX_SCRIPT, (whole, before, after) => {
        return before + script + after;
      });
    case REGEX_HEAD.test(source):
      return source.replace(REGEX_HEAD, script + '</head>');
    default:
      return script + source;
  }
};

const insertStyle = (source, style) => {
  if (REGEX_STYLE.test(source)) {
    return source.replace(REGEX_STYLE, '<head>' + style);
  } else {
    return style + source;
  }
};

exports.default = () => _through2.default.obj((file, encode, next) => {
  if (file.isNull()) return next(null, file);

  let html = file.contents.toString(encode);
  html = insertScript(html, script);
  html = insertStyle(html, style);
  file.contents = new Buffer(html, encode);
  next(null, file);
});

module.exports = exports['default'];