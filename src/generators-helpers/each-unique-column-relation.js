function eachUniqueColumnRelation(fieldsArray, options) {
    // this is used for the lookup
    var dupCheck = {};
    // template buffer
    var buffer = '';
    for (var i = 0; i < fieldsArray.length; i++) {
        var entry = fieldsArray[i];
        if (entry.directives && entry.directives.relation) {
            var uniqueKey = entry.directives && entry.directives.relation && entry.directives.relation.column;
            // check if the entry has been added already
            if (!dupCheck[uniqueKey]) {
                // here there are only unique values
                dupCheck[uniqueKey] = true;
                // add this in the template
                buffer += options.fn(entry);
            }
        }
    }
    // return the template compiled
    return buffer;
}

module.exports = eachUniqueColumnRelation;
