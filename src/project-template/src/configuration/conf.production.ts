import path from 'path';

export default {
    app: {
        port: process.env.PORT || 8081,
        sessionStoreSecret: process.env.APP_SECRET,
        apiUrl: process.env.API_URL,
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
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
            },
        },
        useNullAsDefault: true,
    },
    auth: {
        tokenLinkSecret: process.env.APP_SECRET,
        expire: 1000 * 60 * 60 * 24, // dura un giorno
    },
    logs: {
        folder: path.join(__dirname, '../logs/'),
        streams: [
            {
                level: 'trace',
                type: 'rotating-file',
                path: path.join(__dirname, '../../logs/application.log'),
                period: '1d', // daily rotation
                count: 30, // keep 3 back copies
            },
        ],
        verboseLevel: 1,
        name: '<PROJECT NAME>',
    },
};
