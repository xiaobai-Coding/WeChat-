// // https://github.com/michael-ciniawsky/postcss-load-config

// module.exports = {
//   "plugins": {
//     "postcss-import": {},
//     "postcss-url": {},
//     // to edit target browsers: use "browserslist" field in package.json
//     "autoprefixer": {}
//   }
// }
// 配置微信页面的字体大小
module.exports = {
  plugins: [
    require('postcss-pxtorem')({
      rootValue: 36,
      minPixelValue: 2,
      propWhiteList: []
    })
  ]
}
