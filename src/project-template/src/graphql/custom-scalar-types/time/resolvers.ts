import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import Moment from 'moment';

const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Time',
        description: 'Time custom scalar type',
        parseValue(value: any): any {
            return value; // value from the client (string -> Time)
        },
        serialize(value: any): string {
            return value; // value sent to the client (Time -> string)
        },
        parseLiteral(ast: any): string | null {
            if (ast.kind === Kind.STRING) {
                return ast.value;
            }
            return null;
        },
    }),
};

export default resolvers;
