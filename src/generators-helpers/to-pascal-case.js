const Handlebars = require('handlebars');
const _ = require('lodash');

function toPascalCase(value, options) {
    const pascalCase = _.flow([_.camelCase, _.upperFirst]);
    const result = pascalCase(value);

    return new Handlebars.SafeString(result);
}

module.exports = toPascalCase;
