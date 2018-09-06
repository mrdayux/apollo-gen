import { merge } from 'lodash';

// RESOLVERS
import dateResolvers from './date/resolvers';
import dateTimeResolvers from './date-time/resolvers';

const resolvers = merge(dateResolvers, dateTimeResolvers);

export default resolvers;
