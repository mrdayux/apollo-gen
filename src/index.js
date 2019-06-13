#!/usr/bin/env node
const gqlGen = require('graphql-code-generator');
const fs = require('fs');
const path = require('path');
const ncp = require('ncp');

const mysql = require('./mysql');

const graphgqlPath = path.join(process.cwd(), './src/graphql/');
const entitiesPath = path.join(process.cwd(), './src/graphql/entities/');

const isInit = !!(process.argv && process.argv.find(value => value === 'init'));
const isCreateSchemaFromMysql = !!(process.argv && process.argv.find(value => value === 'mysql-schema'));

if (isCreateSchemaFromMysql) {
    // mysql://user:pass@host/db

    const myqlConnectionString = process.argv.find(value => value.includes(/mysql:\/\//));
    mysql
        .createSchemaFomMysql(myqlConnectionString)
        .then(files => {
            console.log('GraphQL Schema created!');
        })
        .catch(error => {
            console.error(error);
        });
} else if (!isInit) {
    generateFiles()
        .then(files => {
            console.log('Start generate files...');
            moveFiles(files);
        })
        .catch(error => {
            console.error(error);
        });
} else {
    copyProjectTemplateFiles();
}

// FUNCTIONS
function generateFiles() {
    return gqlGen.generate(
        {
            schema: path.join(__dirname, './schema.js'),
            project: path.join(__dirname, './templates/'),
            config: path.join(__dirname, './gql-gen.json'),
        },
        false,
    );
}

function moveFiles(files) {
    files.forEach(file => {
        checkAndMoveFile(file);
    });

    console.log('Done!');
}

function copyProjectTemplateFiles() {
    console.log('Start create project...');

    const source = path.join(__dirname, './project-template');
    const destination = path.join(process.cwd(), './');

    const options = { clobber: false };
    ncp.ncp.limit = 16;
    ncp.ncp(source, destination, options, err => {
        if (err) {
            return console.error(err);
        }

        console.log('Done!');
    });
}

// OTHER FUNCTIONS
function checkAndMoveFile(file) {
    const content = file.content;
    const filename = path.basename(file.filename);

    if (filename.includes('mutation.type') || filename.includes('query.type')) {
        return false;
    }

    // builders
    if (filename.endsWith('-helper-gen.ts')) {
        moveFile(content, graphgqlPath, filename.replace('-gen.ts', '.gen.ts'), true);
    } else if (filename.endsWith('-builder.gql')) {
        moveFile(content, graphgqlPath, filename.replace('-builder.gql', '.gen.gql'), true);
    } else if (filename.endsWith('-builder-gen.ts')) {
        moveFile(content, graphgqlPath, filename.replace('-gen.ts', '.gen.ts'), true);
    } else if (filename.endsWith('-builder.ts')) {
        moveFile(content, graphgqlPath, filename, false);
    } else if (filename.startsWith('dataloaders-gen')) {
        moveEntityFile(content, entitiesPath, filename, 'dataloaders-gen.', '.type.ts', 'ts', true);
    } else if (filename.startsWith('dataloaders')) {
        moveEntityFile(content, entitiesPath, filename, 'dataloaders.', '.type.ts', 'ts', false);
    } else if (filename.startsWith('model-gen')) {
        moveEntityFile(content, entitiesPath, filename, 'model-gen.', '.type.ts', 'ts', true);
    } else if (filename.startsWith('model')) {
        moveEntityFile(content, entitiesPath, filename, 'model.', '.type.ts', 'ts', false);
    } else if (filename.startsWith('resolvers-gen')) {
        moveEntityFile(content, entitiesPath, filename, 'resolvers-gen.', '.type.ts', 'ts', true);
    } else if (filename.startsWith('resolvers')) {
        moveEntityFile(content, entitiesPath, filename, 'resolvers.', '.type.ts', 'ts', false);
    } else if (filename.startsWith('schema-gen')) {
        moveEntityFile(content, entitiesPath, filename, 'schema-gen.', '.type.gql', 'gql', true);
    }
}

function moveFile(content, destFolderPath, destFilename, overwrite) {
    const destFilePath = path.join(destFolderPath, destFilename);
    if (fs.existsSync(destFilePath)) {
        if (!overwrite) {
            return false;
        }
        fs.unlinkSync(destFilePath);
    }
    if (content.length < 70) {
        return true;
    }
    fs.writeFileSync(destFilePath, content);
    console.log(destFilePath);
    return true;
}

function moveEntityFile(content, entitiesPath, filename, startsWith, endsWith, type, overwrite) {
    const destFilename = `${startsWith.replace('-gen.', '.gen.')}${type}`;
    const entityName = filename.replace(startsWith, '').replace(endsWith, '');
    const destFolderPath = path.join(entitiesPath, entityName);
    moveFile(content, destFolderPath, destFilename, overwrite);
}
