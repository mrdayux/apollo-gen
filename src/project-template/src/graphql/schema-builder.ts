import fs from 'fs';
import glob from 'glob';
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import path from 'path';

import customScalarTypesResolvers from './custom-scalar-types/resolvers-builder';
import directiveResolvers from './directives/resolvers-builder';
import resolvers from './resolvers-builder';

const typeDefs: string[] = [];

// loop over types and import the contents
const files = [
    ...glob.sync('./schema.gen.gql', { cwd: __dirname }),
    ...glob.sync('./directives/**/schema.gql', { cwd: __dirname }),
    ...glob.sync('./custom-scalar-types/**/schema.gql', { cwd: __dirname }),
    ...glob.sync('./entities/**/schema.gen.gql', { cwd: __dirname }),
    ...glob.sync('./entities/**/schema.gql', { cwd: __dirname }),
    ...glob.sync('./enum/schema.gql', { cwd: __dirname }),
];

files.forEach((filename: string) => {
    const filePath = path.join(__dirname, filename);
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    typeDefs.push(fileContent);
});

const executableSchema = makeExecutableSchema({
    typeDefs,
    directiveResolvers,
    resolvers: merge(resolvers, customScalarTypesResolvers),
} as any);

export default executableSchema;
