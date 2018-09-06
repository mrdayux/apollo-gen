const Handlebars = require('handlebars');

function customSchema(entry, method, options) {
    if (!entry.directives || !entry.directives.customSchema || !entry.directives.customSchema[method]) {
        return options.fn(this);
    }

    return `## Custom Schema - ${options.fn(this)}`;
}

module.exports = customSchema;
