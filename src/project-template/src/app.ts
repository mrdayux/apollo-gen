import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import expressValidator from 'express-validator';
import raven from 'raven';

import api from './api';
import configuration from './configuration';
import graphqlServer from './graphql';
import log from './logging';
import * as logger from './middleware/logger';

// Create Express server
const app = express();

// Express configuration
app.set('port', configuration.app.port);
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging with bunyan
app.use(logger.createLogger(log));

app.use(expressValidator());

// Raven (Sentry) configuration
if (configuration.sentry && configuration.sentry.dns) {
    raven.config(configuration.sentry.dns).install();
    app.use(raven.errorHandler());
    // tslint:disable-next-line:no-console
    log.info('Activated Sentry Error tracking');
}

graphqlServer.applyMiddleware({ app, cors: configuration.app.corsOptions });
app.use('/api', api);

// Logging result with bunyan
app.use(logger.createResultLogger());
app.use(logger.catchErr(log));

export default app;
