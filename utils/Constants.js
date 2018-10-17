const validate = (schema, object) => {
    let valid = true;
    let reason = null;
    Object.keys(schema).forEach( key => {
        if (!(typeof object[key] == schema[key].name.toLowerCase())) {
            valid = false
            return reason = `${key} wrong data type, expected: ${schema[key].name}, received: ${typeof object[key]}`;
        }
    });
    return { valid, reason }
}

module.exports = {
    validate
}