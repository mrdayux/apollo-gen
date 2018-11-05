import { merge } from 'lodash';

// RESOLVERS
import dateResolvers from './date/resolvers';
import dateTimeResolvers from './date-time/resolvers';
import timeResolvers from './time/resolvers';

const resolvers = merge(dateResolvers, dateTimeResolvers, timeResolvers);

export default resolvers;
