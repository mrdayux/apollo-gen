const Handlebars = require('handlebars');

function isArray(field, options) {
    if (!field) {
        return '';
    }

    if (field.isArray || (field.directives['column'] && field.directives['column'].isArray)) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}

module.exports = isArray;
