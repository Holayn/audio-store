const express = require("express");
const helmet = require("helmet");
const winston = require('winston');
const expressWinston = require('express-winston');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');
const history = require('connect-history-api-fallback');

const routes = require('./routes');

const app = express();

app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    'media-src': ["'self'", 'data:'],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://storage.googleapis.com'],
  },
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(history({
  rewrites: [
    {
      from: /\/api/,
      to: function(context) {
        console.log('WTF');
        return context.parsedUrl.pathname;
      }
    },
  ],
})); // spa

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
}));

app.use('/api', routes);

app.use('/', express.static(path.join(__dirname, '../audio-store-web/dist')));

const httpsServer = https.createServer({
  key: fs.readFileSync(__dirname + '/sslcert/192.168.0.133-key.pem', 'utf8'),
  cert: fs.readFileSync(__dirname + '/sslcert/192.168.0.133.pem', 'utf8'),
}, app);

httpsServer.listen(8000);
