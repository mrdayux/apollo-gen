function generate(entry, methods, language, options) {
    if (!entry.directives || !entry.directives.generate) {
        return options.fn(this);
    } else {
        const methodsArray = methods.split(',');
        let show = methodsArray.reduce((acc, method) => {
            return acc || !!entry.directives.generate[method];
        }, false);

        if (show) {
            return options.fn(this);
        }
    }

    if (language === 'gql') {
        return `## ${options.fn(this)}`;
    } else {
        return `// ${options.fn(this).replace(/\n/gi, '\n// ')}`;
    }
}

module.exports = generate;
