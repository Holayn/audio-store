const fs = require('fs');

module.exports = {
  devServer: {
    https: true,
    key: fs.readFileSync(__dirname + '/192.168.0.133-key.pem', 'utf8'),
    cert: fs.readFileSync(__dirname + '/192.168.0.133.pem', 'utf8'),
  }
}