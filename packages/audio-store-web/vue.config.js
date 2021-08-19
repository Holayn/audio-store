const fs = require('fs');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
  devServer: {
    https: true,
    key: fs.readFileSync(__dirname + '/192.168.0.133-key.pem', 'utf8'),
    cert: fs.readFileSync(__dirname + '/192.168.0.133.pem', 'utf8'),
  },
  configureWebpack: {
    plugins: [
      // Other plugins...
      new GenerateSW({
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5000000,
      }),
    ],
  },
}