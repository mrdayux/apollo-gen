// import gql from 'graphql-tag';
import * as chai from 'chai';
import { getGraphQLSchema, schemaToTemplateContext } from '../graphql-to-js';

const expect = chai.expect;

const schema = `
    enum RelationType {
        ONE_TO_ONE
        ONE_TO_MANY
        MANY_TO_ONE
        MANY_TO_MANY
    }

    enum SortDirection {
        ASC
        DESC
    }

    enum Role {
        ADMIN
        USER
        NONE
    }
    
    interface Node {
        id: Int
    }

    input AuthRole {
        role: Role!
        conditions: String
    }

    type Query {
        _: Int
    }

    type Mutation {
        _: Int
    }

    type Subscription {
        _: Int
    }

    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }

    #
    ## DIRECTIVES ##
    # Table
    directive @entity(table: String, singular: String, plural: String) on OBJECT

    # Field
    directive @column on FIELD_DEFINITION

    directive @id on FIELD_DEFINITION

    directive @unique on FIELD_DEFINITION

    directive @relation(relationType: RelationType, column: String, fkTable: String, fkColumn: String) 
        on FIELD_DEFINITION

    directive @auth(
        getOneRoles: [AuthRole!]
        getAllRoles: [AuthRole!]
        createRoles: [AuthRole!]
        updateRoles: [AuthRole!]
        deleteRoles: [AuthRole!]
    ) on OBJECT | FIELD | FIELD_DEFINITION

    directive @notGenerated on FIELD_DEFINITION

    directive @generate(
        getOne: Boolean
        getAll: Boolean
        create: Boolean
        update: Boolean
        delete: Boolean
    ) on OBJECT | FIELD | FIELD_DEFINITION

    # directive @stringManipulation(lowercase: Boolean, trim: Boolean, uppercase: Boolean) on FIELD_DEFINITION

    # directive @validation(min: Int, max: Int) on FIELD_DEFINITION

    # directive @match(regex: String, error: String) on FIELD_DEFINITION

    # Union
    # directive @discrimination on UNION

    type Test
        @entity(table: "test", singular: "Test", plural: "Tests")
        @auth(
            getOneRoles: [{ role: ADMIN }, { role: USER }, { role: NONE }]
            getAllRoles: [{ role: ADMIN }, { role: USER }, { role: NONE }]
            createRoles: [{ role: ADMIN }, { role: USER }, { role: NONE }]
            updateRoles: [{ role: ADMIN }, { role: USER }, { role: NONE }]
            deleteRoles: [{ role: ADMIN }, { role: USER }, { role: NONE }]
        ) {
        id: Int! @column @id
        testId: Int @column
        name: String! @column

        parent: Test! @relation(relationType: MANY_TO_ONE, column: "testId", fkTable: "test", fkColumn: "id")
        childrens: Test! @relation(relationType: ONE_TO_MANY, column: "id", fkTable: "test", fkColumn: "testId")
    }
`;

describe('Call getJsSchema', () => {
    it('return a js object with schema', async done => {
        const gqlSchema = getGraphQLSchema(schema);
        expect(gqlSchema).is.not.null;
        expect(gqlSchema).to.be.an('GraphQlSchema');
        return done();
    });
});
