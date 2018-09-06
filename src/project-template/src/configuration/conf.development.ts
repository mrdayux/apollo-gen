import path from 'path';

export default {
    app: {
        port: process.env.PORT || 8081,
        sessionStoreSecret: '<SECRET>',
        apiUrl: 'http://localhost:8081',
    },
    graphql: {
        persistedQueries: false,
        tracing: false,
        cacheControl: false,
        introspection: true,
        playground: true,
        subscriptions: false,
    },
    engine: {
        apiKey: process.env.ENGINE_API_KEY,
    },
    sentry: {
        dns: process.env.SENTRY_DNS,
    },
    database: {
        db: {
            client: 'mysql',
            connection: {
                host: process.env.DB_HOST || '127.0.0.1',
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER || '<DATABASE NAME>',
                password: process.env.DB_PASSWORD || '<DATABASE USERNAME>',
                database: process.env.DB_DATABASE || '<DATABASE PASSWORD>',
            },
        },
        useNullAsDefault: true,
    },
    auth: {
        tokenLinkSecret: '<SECRET>',
        expire: 1000 * 60 * 60 * 24, // dura un giorno
    },
    logs: {
        folder: path.join(__dirname, '../logs/'),
        streams: [
            {
                level: 'debug',
                stream: process.stdout, // log INFO and above to stdout
            },
        ],
        verboseLevel: 1,
        name: '<PROJECT NAME>',
    },
};
