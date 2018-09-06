import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import Moment from 'moment';

const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value: any): any {
            return Moment(value, 'YYYY-MM-DD').toDate(); // value from the client (string -> Date)
        },
        serialize(value: any): string {
            return Moment(value).format('YYYY-MM-DD'); // value sent to the client (Date -> string)
        },
        parseLiteral(ast: any): string | null {
            if (ast.kind === Kind.STRING) {
                return Moment(ast.value.toString(), 'YYYY-MM-DD').format('YYYY-MM-DD');
            }
            return null;
        },
    }),
};

export default resolvers;
