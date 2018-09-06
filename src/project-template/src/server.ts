import errorHandler from 'errorhandler';
import http from 'http';

import log from './logging';
import configuration from './configuration/index';
import app from './app';
import graphqlServer from './graphql';

/**
 * Error Handler. Provides full stack - deve essere disattivato per production
 */
if (process.env.NODE_ENV !== 'production') {
    app.use(errorHandler());
}

const httpServer = http.createServer(app);
if (configuration.graphql.subscriptions) {
    graphqlServer.installSubscriptionHandlers(httpServer);
}

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
const server = httpServer.listen(app.get('port'), () => {
    log.info(
        `🚀 Server ready at http://localhost:${app.get('port')}${graphqlServer.graphqlPath} in ${app.get('env')} mode`,
    );
    if (configuration.graphql.subscriptions) {
        log.info(
            `🚀 Subscriptions ready at ws://localhost:${app.get('port')}${graphqlServer.subscriptionsPath} in ${app.get(
                'env',
            )} mode`,
        );
    }
    log.info('  Press CTRL-C to stop\n');
});

export default server;
