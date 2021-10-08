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
  index: '/audio-store',
  rewrites: [
    {
      from: /\/api/,
      to: function(context) {
        return context.parsedUrl.pathname;
      }
    },
  ],
  verbose: true,
})); // spa

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.label({ label: 'server'}),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`;
    },
  )),
  meta: false,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
}));

app.use('/audio-store/api', routes);

app.use('/audio-store', express.static(path.join(__dirname, '../web/dist')));

const httpsServer = https.createServer({
  key: fs.readFileSync(__dirname + '/sslcert/192.168.0.133-key.pem', 'utf8'),
  cert: fs.readFileSync(__dirname + '/sslcert/192.168.0.133.pem', 'utf8'),
}, app);

const port = process.env.PORT || 8000;
httpsServer.listen(port, () => {
  console.log(`---Server started on ${port}---`);
});
