import knex from 'knex';
import configuration from '../configuration/index';

const _knex = knex(configuration.database.db);

export const beginTransaction = async (): Promise<knex.Transaction> => {
    return new Promise<knex.Transaction>((resolve, reject) => {
        _knex
            .transaction(trx => {
                return resolve(trx);
            })
            .catch(err => {
                return reject(err);
            });
    });
};

export default _knex;
