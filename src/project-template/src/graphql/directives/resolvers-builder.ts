import { merge } from 'lodash';

// RESOLVERS
import hasRoleResolvers from './has-role/resolvers';

const resolvers = merge(hasRoleResolvers);

export default resolvers;
