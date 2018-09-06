
import { ForbiddenError, AuthenticationError } from 'apollo-server';

import { Role } from '../../enum';
import { IContext } from '../../index';

export default {
    hasRole: async (next: () => any, _: void, { roles }: { roles: AuthRole[] }, ctx: IContext) => {
        if (roles && roles.length) {
            const anonymousRole = roles.find((role: AuthRole) => {
                if (role && role.role && role.role.trim() === Role.NONE) {
                    return true;
                }
                return false;
            });
            let conditionsJSON;

            if (ctx && ctx.viewer) {
                const roleCtx = ctx.viewer.role;
                const roleMatched = roles.find((role: AuthRole) => {
                    if (role && role.role && role.role.trim() === roleCtx) {
                        return true;
                    }
                    return false;
                });

                if (!roleMatched) {
                    throw new ForbiddenError('Forbidden resource');
                }

                if (roleMatched.conditions) {
                    conditionsJSON = roleMatched.conditions;
                }
            } else if (anonymousRole) {
                conditionsJSON = anonymousRole.conditions;
            } else {
                throw new AuthenticationError('A user must be logged in.');
            }

            if (conditionsJSON) {
                ctx.authWhere = mergeObj(conditionsJSON, ctx.viewer);
            }
        }

        return next();
    },
};

const mergeObj = (conditionsJSON: string, viewer: any): any => {
    const keys = Object.keys(viewer);
    const mergedConditionsJSON = keys.reduce((json: string, key: string) => {
        return json.replace(new RegExp(`{{viewer\.${key}}}`, 'gi'), viewer[key].toString());
    }, conditionsJSON);

    return JSON.parse(mergedConditionsJSON);
};
