const validate = (schema, object) => {
    let valid = true;
    let reason = null;
    Object.keys(schema).forEach( key => {
        if ( (schema[key] == Array && Array.isArray(object[key])) ) {
            return false
        } else if (!(typeof object[key] == schema[key].name.toLowerCase())) {
            valid = false
            return reason = `${key} wrong data type, expected: ${schema[key].name}, received: ${typeof object[key]}`;
        }
    });
    return { valid, reason }
}

const ip = "192.168.1.14"

module.exports = {
    validate,
    ip
}