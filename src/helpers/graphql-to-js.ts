import { mergeGraphQLSchemas } from '@graphql-modules/epoxy';
import { buildSchema, DocumentNode, GraphQLSchema } from 'graphql';
import { schemaToTemplateContext } from 'graphql-codegen-core';

export const getGraphQLSchema = (schema: string): GraphQLSchema => {
    const gqlSchema = buildSchema(schema);
    return gqlSchema;
};

export const graphQLSchemaToTemplateContext = schemaToTemplateContext;

export function mergeSchemas(schemas: Array<string | GraphQLSchema | DocumentNode>): DocumentNode | null {
    const schemasValid = schemas.filter(s => s);

    if (schemasValid.length === 0) {
        return null;
    } else {
        return mergeGraphQLSchemas(schemasValid);
    }
}
