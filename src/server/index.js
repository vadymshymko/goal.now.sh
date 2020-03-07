import express from 'express';
import compression from 'compression';

import getResponse from './getResponse';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const isWithHMR = isDev && process.env.APP_HMR === 'true';

const app = express();
const appPort = process.env.PORT || process.env.APP_SERVER_LISTEN_PORT;

// app.engine('pug', require('pug').__express);//eslint-disable-line
// app.set('view engine', 'pug');
// app.set('views', `${process.env.APP_SERVER_BUILD_OUTPUT_PATH}/views`);

if (isWithHMR) {
  /* eslint-disable global-require */
  const { devMiddleware, hotMiddleware } = require('./middlewares/webpack');
  /* eslint-enable global-require */
  app.use(devMiddleware());
  app.use(hotMiddleware());
}

if (isProd) {
  app.disable('x-powered-by');
  app.use(compression());
}

app.use(
  process.env.APP_CLIENT_BUILD_PUBLIC_PATH,
  express.static(process.env.APP_CLIENT_BUILD_OUTPUT_PATH, {
    etag: isProd,
    maxAge: isProd ? process.env.APP_CLIENT_ASSETS_CACHE_MAX_AGE : 0,
    redirect: false,
    setHeaders: (res, path) => {
      if (path.includes('service-worker.js')) {
        res.setHeader('Service-Worker-Allowed', '/');
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

app.get('*', getResponse);

const server = app.listen(appPort, () => {
  console.info(`app listening on port: ${appPort}`); // eslint-disable-line
});

const handleSIG = () => {
  console.info('Starting shutdown');

  server.close(() => {
    console.info('connection closed. shutdown finished.');
    process.exit();
  });
};

process.on('SIGINT', handleSIG);
process.on('SIGTERM', handleSIG);
