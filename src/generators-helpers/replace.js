const Handlebars = require('handlebars');

function replace(string, replaceValue, options) {
    const text = options.fn(this);
    return new Handlebars.SafeString(text.replace(new RegExp(string, 'gi'), replaceValue));
}

module.exports = replace;
