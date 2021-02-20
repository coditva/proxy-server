const https = require('https'),
  http = require('http'),
  fs = require('fs');
  express = require('express'),
  config = require('./config'),
  middlewares = require('./lib/middlewares'),
  PROP_NAMES = require('./lib/constants/prop-names');

// Don't start the app if access token is not specified. It will render the app
// insecure.
if (!config.accessToken) {
  console.error('Access token not set. Aborting...');

  process.exit(1);
}

const app = express(),
  port = config.port,
  httpsOptions = {
    key: fs.readFileSync('./assets/certs/key.pem'),
    cert: fs.readFileSync('./assets/certs/cert.pem')
  };

// Add all middlewares
app.use(middlewares);

// Proxy requests to local server
app.all('*', (req, res) => {
  const target = req[PROP_NAMES.target],

    // Send the request to the actual target in the local network
    proxyReq = http.request(target, (proxyRes) => {
      // Write head data
      res.status(proxyRes.statusCode);
      res.set(proxyRes.headers);

      // Pipe the response
      proxyRes.pipe(res);
    });

  // Attach error handler
  proxyReq.on('error', (e) => {
    res.status(500).send(e);
  });

  // Pipe the request body
  req.pipe(proxyReq);
  req.on('end', () => {
    proxyReq.end();
  });
});

https.createServer(httpsOptions, app).listen(port, () => console.info('Started'));
