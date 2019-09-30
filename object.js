/**
 * Object merging function when object contains deeper levels
 * @param  {...objects} sources - { default: {}, new: {}}
 */
export function deepMerge(...sources) {
    let container = {};
    for (const source of sources) {
        // Only update container if the source is an object
        if (source instanceof Object) {
            // Iterate through key and value (disable eslint since we change 'value' but not key and eslint want key to be a const)
            for (let [key, value] of Object.entries(source)) { // eslint-disable-line
                // if key already exists in our container we run the function again going one step deeper into the object
                if (value instanceof Object && key in container) {
                    value = deepMerge(container[key], value);
                }
                // if value isnt an object and key doesnt exist in our container, we add the new key and value
                container = { ...container, [key]: value };
            }
        }
    }
    return container;
}

// Takes two objects, setObject with property values that corresponds to keys in getObject
// Copies values from getObject into a new copy of setObject and returns it
export function assignObjectVariables(setObject, getObject) {
    const returnObj = {};
    Object.keys(setObject).forEach((objKey) => {
        returnObj[objKey] = getObject[setObject[objKey]] ? getObject[setObject[objKey]] : setObject[objKey];
    });
    return returnObj;
}

export function getObject(obj, path) {
    return path.split('.').reduce((o, key) => (o && o[key] ? o[key] : ''), obj);
}

export function setObject(obj, path, value, delimiter) {
    let arr;
    let key;
    if (!obj || typeof obj !== 'object') {
        obj = {};
    }
    if (typeof path === 'string') {
        path = path.split(delimiter || '.');
    }
    if (Array.isArray(path) && path.length > 0) {
        arr = path;
        key = arr[0];
        if (arr.length > 1) {
            arr.shift();
            obj[key] = setObject(obj[key], arr, value, delimiter);
        } else {
            obj[key] = value;
        }
    }
    return obj;
}

export function flattenObject(ob) {
    const toReturn = {};

    for (let i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if (typeof ob[i] === 'object' && ob[i] !== null) {
            const flatObject = flattenObject(ob[i]);
            for (let x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}
