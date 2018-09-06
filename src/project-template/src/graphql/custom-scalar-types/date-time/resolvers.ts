import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import Moment from 'moment';

const resolvers = {
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'DateTime custom scalar type',
        parseValue(value: any): any {
            return Moment(value, 'YYYY-MM-DD HH:mm').toDate(); // value from the client (number -> Date)
        },
        serialize(value: any): string {
            return Moment(value).format('YYYY-MM-DD HH:mm'); // value sent to the client (number -> Date)
        },
        parseLiteral(ast: any): string | null {
            if (ast.kind === Kind.STRING) {
                return Moment(ast.value.toString(), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm');
            }
            return null;
        },
    }),
};

export default resolvers;
