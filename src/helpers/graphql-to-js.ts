import { graphql, GraphQLSchema, introspectionQuery } from 'graphql';

export const getJsSchema = async (schema: any) => {
    const jsSchema = await graphql(schema, introspectionQuery);
    console.log(jsSchema);
    return jsSchema;
};
