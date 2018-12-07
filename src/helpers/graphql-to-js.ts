import { graphql, buildSchema, GraphQLSchema, introspectionQuery } from 'graphql';

export const getJsSchema = async (schema: string) => {
    return graphql(buildSchema(schema), introspectionQuery);
};
