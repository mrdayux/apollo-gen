import gql from 'graphql-tag';
import * as chai from 'chai';
import { getJsSchema } from '../graphql-to-js';

const expect = chai.expect;

const schema = `
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
    it('return a js object with schema', done => {
        getJsSchema(schema)
            .then(jsObj => {
                console.log(jsObj);
                expect(jsObj).is.not.null;
                expect(jsObj).to.be.an('object');

                return done();
            })
            .catch(err => {
                return done(err);
            });
    });
});
