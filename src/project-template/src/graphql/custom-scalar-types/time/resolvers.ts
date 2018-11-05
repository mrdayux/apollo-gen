import { GraphQLScalarType } from 'graphql';
import { ValidationError } from 'apollo-server';
import { Kind } from 'graphql/language';
import Moment from 'moment';

const resolvers = {
    Time: new GraphQLScalarType({
        name: 'Time',
        description: 'Time custom scalar type',
        parseValue(value: any): any {
            const date = Moment('2000-01-01 ' + value, 'YYYY-MM-DD H:mm', true);
            if (!date.isValid()) {
                throw new ValidationError(`'${value}' is not a valid time format (HH:dd).`);
            }

            return date.format('HH:mm'); // value from the client (string -> Time)
        },
        serialize(value: any): string {
            // value sent to the client (Time -> string)
            return Moment('2000-01-01 ' + value, 'YYYY-MM-DD H:mm').format('HH:mm');
        },
        parseLiteral(ast: any): string | null {
            if (ast.kind === Kind.STRING) {
                const date = Moment('2000-01-01 ' + ast.value.toString(), 'YYYY-MM-DD H:mm', true);
                if (!date.isValid()) {
                    throw new ValidationError(`'${ast.value.toString()}' is not a valid time format (HH:dd).`);
                }

                return date.format('HH:mm');
            }
            return null;
        },
    }),
};

export default resolvers;
