import express from 'express';

import configs from '../configuration';

export const createLogger = (log: any) => {
    const middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.log = log;

        let logReq;
        switch (configs.logs.verboseLevel) {
            case 1:
                logReq = `${req.method} ${req.url}`;
                if (req.body && req.body.operationName) {
                    logReq += `  [${req.body.operationName}]`;
                }
                break;
            case 2:
                logReq = {
                    req: {
                        body: req.body,
                        headers: req.headers,
                        method: req.method,
                        url: req.url,
                        params: req.params,
                        query: req.query,
                    },
                };
                break;
            case 0:
            default:
                break;
        }
        log.child({ module: 'req' }).info(logReq);

        req.startTimeTrc = Date.now();

        return next();
    };
    return middleware;
};

export const createResultLogger = () => {
    const middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        resultLogging(req, res);

        next();
    };
    return middleware;
};

export const resultLogging = (req: express.Request, res?: express.Response) => {
    let logRes;

    if (!req.startTimeTrc) {
        throw new Error('"startTimeTrc" is undefined.');
    }

    const responseTime = Date.now() - req.startTimeTrc;
    switch (configs.logs.verboseLevel) {
        case 1:
            logRes = '';
            if (req.body && req.body.operationName) {
                logRes += `[${req.body.operationName}]`;
            }
            logRes += ` responded in ${responseTime}ms`;
            break;
        case 2:
            logRes = {
                res: res || '',
                responseTime,
            };
            break;
        case 0:
        default:
            break;
    }
    req.log.child({ module: 'res' }).info(logRes);
};

export const catchErr = (log: any) => {
    // eslint-disable-next-line
    const middleware = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        log.child({ module: 'req' }).error();

        log.error(
            {
                res,
                err: {
                    type: err.constructor.name,
                    message: err.message,
                    stack: err.stack,
                },
                responseTime: res.responseTime,
            },
            'request errored',
        );
        return next(err);
    };
    return middleware;
};
