// in questo file vengono uniti gli schema e i resolver
const graphTools = require('graphql-tools');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

const typeDefs = [];

// loop over types and import the contents
const files = [
    ...glob.sync('./src/graphql/schema.gen.gql'),
    ...glob.sync('./src/graphql/custom-scalar-types/**/schema.gql'),
    ...glob.sync('./src/graphql/directives/**/schema.gql'),
    ...glob.sync('./src/graphql/entities/**/type.gql'),
    ...glob.sync('./src/graphql/enum/schema.gql'),
];

files.forEach(filename => {
    const filePath = path.join(process.cwd(), filename);
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    typeDefs.push(fileContent);
});

const executableSchema = graphTools.makeExecutableSchema({
    typeDefs,
});

exports.default = executableSchema;
