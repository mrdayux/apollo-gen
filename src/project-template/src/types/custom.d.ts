declare namespace Express {
    export interface Request {
        user?: any;
        viewer?: Viewer;
        log?: any;
        startTimeTrc?: number;
    }

    export interface Response {
        sentry?: string;
        responseTime?: Date | number;
    }
}

interface AuthRole {
    role: string;
    conditions?: string;
}

interface Viewer {
    userId: number;
    role: string;
}

interface QueryArgs<T, V, K> {
    where?: T;
    orderBy?: V[];
    sortBy?: K[];
    limit: number;
    offset?: number;
}

interface QueryRelationArgs<T, V, K> {
    where?: T;
    orderBy?: V[];
    sortBy?: K[];
}
