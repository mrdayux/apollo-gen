const mysql = require('mysql');
const pluralize = require('pluralize');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const entitiesPath = path.join(process.cwd(), './src/graphql/entities/');

exports.createSchemaFomMysql = function createSchemaFomMysql(mysqlConnectionString) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(mysqlConnectionString);

        executeQuery(connection, 'show tables;', [])
            .then(({ results, fields }) => {
                const fieldName = fields && fields[0] && fields[0].name;
                const tables = results.map(tableObj => tableObj[fieldName]);

                return tables;
            })
            .then(tables => {
                return Promise.all(
                    tables.map(table => {
                        return getFieldsAndRelationships(connection, table);
                    }),
                );
            })
            .then(tablesDetails => {
                return tablesDetails.map(tableDetails => {
                    const fileContent = createSchemaGql(tableDetails, tablesDetails);
                    return {
                        table: tableDetails.table,
                        content: fileContent,
                    };
                });
            })
            .then(tableFiles => {
                return tableFiles.map(tableFile => {
                    return saveSchemaFile(tableFile);
                });
            })
            .catch(error => {
                console.error(error);
            })
            .finally((result) => {
                if (connection) {
                    connection.end(function(err) {
                        return resolve(result);
                    });
                } else {
                    return resolve(result);
                }
            });
    });
};

// PRIVATE FUNCTIONS

function executeQuery(connection, sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, function(error, results, fields) {
            if (error) {
                return reject(error);
            }

            return resolve({ results, fields });
        });
    });
}

function getFieldsAndRelationships(connection, table) {
    const sqlFields = `
        SELECT COLUMN_NAME, 
            DATA_TYPE, 
            IS_NULLABLE,
            COLUMN_KEY
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = ?
            AND table_schema = ?
    `;
    const sqlInnerRelationships = `
        SELECT
            R.TABLE_NAME,
            R.COLUMN_NAME,
            R.CONSTRAINT_NAME,
            R.REFERENCED_TABLE_NAME,
            R.REFERENCED_COLUMN_NAME,
            C.IS_NULLABLE
        FROM
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS R JOIN INFORMATION_SCHEMA.COLUMNS AS C
                ON R.TABLE_SCHEMA = C.TABLE_SCHEMA AND R.TABLE_NAME = C.TABLE_NAME AND R.COLUMN_NAME = C.COLUMN_NAME
        WHERE
            R.TABLE_NAME = ?
            AND R.TABLE_SCHEMA = ?
            AND R.REFERENCED_TABLE_NAME IS NOT NULL
    `;
    const sqlOuterRelationships = `
        SELECT
            TABLE_NAME,
            COLUMN_NAME,
            CONSTRAINT_NAME,
            REFERENCED_TABLE_NAME,
            REFERENCED_COLUMN_NAME
        FROM
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE
            REFERENCED_TABLE_NAME = ?
            AND REFERENCED_TABLE_SCHEMA = ?
    `;
    return Promise.all([
        executeQuery(connection, sqlFields, [table, connection.config.database]),
        executeQuery(connection, sqlInnerRelationships, [table, connection.config.database]),
        executeQuery(connection, sqlOuterRelationships, [table, connection.config.database]),
    ]).then(([fields, innerRelationships, outerRelationships]) => {
        return {
            table,
            fields: fields.results,
            innerRelationships: innerRelationships.results,
            outerRelationships: outerRelationships.results,
        };
    });
}

function createSchemaGql(tableDetails, tablesDetails) {
    const tableSingularCapitalized = capitalizeFirstLetter(tableDetails.table);
    const tableSingular = tableDetails.table;
    const tablePluralCapitalized = capitalizeFirstLetter(pluralize.plural(tableDetails.table));

    const templateFields = tableDetails.fields.map(createTemplateField).join('');
    const templateInnerRelationship = tableDetails.innerRelationships.map(createTemplateInnerRelationship).join('');
    const templateOuterRelationship = tableDetails.outerRelationships.map(createTemplateOuterRelationship).join('');

    const templateFile = `type ${tableSingularCapitalized}
    @entity(table: "${tableSingular}", singular: "${tableSingularCapitalized}", plural: "${tablePluralCapitalized}")
    @auth(
        getOneRoles: [{ role: ADMIN }, { role: USER }, { role: NONE }]
        getAllRoles: [{ role: ADMIN }, { role: USER }, { role: NONE }]
        createRoles: [{ role: ADMIN }, { role: USER }, { role: NONE }]
        updateRoles: [{ role: ADMIN }, { role: USER }, { role: NONE }]
        deleteRoles: [{ role: ADMIN }, { role: USER }, { role: NONE }]
    ) 
    @generate(getOne: true, getAll: true, create: true, update: true, delete: true) {

    ${templateFields}

    ${templateInnerRelationship}

    ${templateOuterRelationship}
}
    `;

    return templateFile;
}

function createTemplateField(field) {
    const template = `${field.COLUMN_NAME}: ${mapDataType(field.DATA_TYPE)}${
        field.IS_NULLABLE === 'NO' ? '!' : ''
    } @column ${field.COLUMN_KEY === 'PRI' ? '@id' : ''}
    `;
    return template;
}

function createTemplateInnerRelationship(relationship) {
    const tableSingularCapitalized = capitalizeFirstLetter(relationship.REFERENCED_TABLE_NAME);

    const template = `${relationship.REFERENCED_TABLE_NAME}: ${tableSingularCapitalized}${
        relationship.IS_NULLABLE === 'NO' ? '!' : ''
    } @relation(relationType: MANY_TO_ONE, column: "${relationship.COLUMN_NAME}", fkTable: "${
        relationship.REFERENCED_TABLE_NAME
    }", fkColumn: "${relationship.REFERENCED_COLUMN_NAME}")
    `;
    return template;
}

function createTemplateOuterRelationship(relationship) {
    const tableSingularCapitalized = capitalizeFirstLetter(relationship.TABLE_NAME);
    const tablePlural = pluralize.plural(relationship.TABLE_NAME);

    const template = `${tablePlural}: [${tableSingularCapitalized}!]! @relation(relationType: ONE_TO_MANY, column: "${
        relationship.REFERENCED_COLUMN_NAME
    }", fkTable: "${relationship.TABLE_NAME}", fkColumn: "${relationship.COLUMN_NAME}")
    `;
    return template;
}

function saveSchemaFile(tableFile) {
    const destFolderPath = path.join(entitiesPath, `/${tableFile.table}`);
    const destFilePath = path.join(destFolderPath, '/type.gql');

    try {
        if (!fs.existsSync(destFolderPath)) {
            fs.mkdirSync(destFolderPath);
        }

        fs.writeFileSync(destFilePath, tableFile.content);
    } catch (err) {
        console.error(err);
        return false;
    }

    return true;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function mapDataType(type) {
    switch (type.toLowerCase()) {
        case 'int':
        case 'smallint':
        case 'bigint':
            return 'Int';

        case 'decimal':
        case 'float':
        case 'double':
            return 'Float';

        case 'varchar':
        case 'text':
        case 'longtext':
        case 'mediumtext':
            return 'String';

        case 'tinyint':
            return 'Boolean';

        case 'timestamp':
        case 'datetime':
            return 'DateTime';

        case 'date':
            return 'Date';

        default:
            return type + ' - TODO!';
    }
}
