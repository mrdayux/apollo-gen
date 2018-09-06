import { ApolloServer, PubSub } from 'apollo-server-express';
import { ApolloError } from 'apollo-server';
import { Request } from 'express';
import depthLimit from 'graphql-depth-limit';
import raven from 'raven';

import configuration from '../configuration/index';
import dataloadersBuilder from '../graphql/dataloaders-builder';
import models from '../graphql/models-builder';
import schema from '../graphql/schema-builder';
import * as logger from '../middleware/logger';
import log from '../logging';

// Apollo Engine
let engine;
if (configuration.engine.apiKey) {
    log.info('Activated Apollo Engine');
    engine = {
        apiKey: configuration.engine.apiKey,
    };
}

// Subscription
export let pubsub: PubSub;
if (configuration.graphql.subscriptions) {
    pubsub = new PubSub();
}

const server = new ApolloServer({
    schema,
    engine,
    tracing: configuration.graphql.tracing,
    cacheControl: configuration.graphql.cacheControl,
    introspection: configuration.graphql.introspection,
    playground: configuration.graphql.playground,
    validationRules: [depthLimit(6)],
    context: ({ req, connection }: { req: Request; connection: any }) => {
        if (!req && !connection) {
            throw new ApolloError('Request not found');
        }

        if (connection) {
            req = connection;
        }

        const context: IContext = {
            viewer: req.viewer as Viewer,
            models,
            dataloaders: dataloadersBuilder(models),
            log: req.log,
            raven,
            req,
        };

        return context;
    },
    formatResponse: (response: any, { context }: { context: IContext }) => {
        logger.resultLogging(context.req);
        return response;
    },
    formatError: (error: any) => {
        log.error(JSON.stringify(error, null, 4));
        return error;
    },
});

export type Models = typeof models;

export interface IContext {
    viewer: Request['viewer'];
    models: Models;
    dataloaders: any;
    log: Request['log'];
    raven: typeof raven;
    req: Request;
    authWhere?: any;
}

export default server;
