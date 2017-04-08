"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Storage class which manages saving and retriving data between bot launches.
 * Extensions can access this class through ex.world.storage.
 */
class Storage {
    constructor(namespace) {
        this.namespace = String(namespace);
    }
    /**
     * Gets a string from the storage if it exists and returns it, otherwise returns fallback.
     *
     * @example
     * var x = getString('stored_prefs', 'nothing');
     * var y = getString('stored_prefs', 'nothing', false);
     *
     * @param key the key to retrieve.
     * @param fallback what to return if the key was not found.
     * @param local whether or not to use a namespace when checking for the key.
     */
    getString(key, fallback, local) {
        var result;
        if (local) {
            result = localStorage.getItem(`${key}${this.namespace}`);
        }
        else {
            result = localStorage.getItem(key);
        }
        return (result === null) ? fallback : result;
    }
    /**
     * Gets a stored object if it exists, otherwise returns fallback.
     *
     * @example
     * var x = getObject('stored_key', [1, 2, 3]);
     *
     * @param key the item to retrieve.
     * @param fallback what to return if the item does not exist or fails to parse correctly.
     * @param local whether or not a namespace should be used.
     */
    getObject(key, fallback, local) {
        var result = this.getString(key, '', local);
        if (!result) {
            return fallback;
        }
        try {
            result = JSON.parse(result);
        }
        catch (e) {
            result = fallback;
        }
        finally {
            if (!result) {
                result = fallback;
            }
        }
        return result;
    }
    /**
     * Sets an object in the storage, stringifying it first if neccessary.
     *
     * @example
     * set('some_key', {a: [1, 2, 3], b: 'test'});
     * //returns '{"a":[1,2,3],"b":"test"}'
     * getString('some_key');
     * @param key the item to overwrite or create.
     * @param data any stringifyable type.
     * @param local whether to save the item with a namespace.
     */
    set(key, data, local) {
        if (local) {
            key = `${key}${this.namespace}`;
        }
        if (typeof data == 'string') {
            localStorage.setItem(key, data);
        }
        else {
            localStorage.setItem(key, JSON.stringify(data));
        }
    }
    /**
     * Removes all items starting with namespace from the storage.
     *
     * Note: Using Object.keys(localStorage) works, but is not covered in the spec.
     *
     * @example
     * set('key+test', 1);
     * set('key+test2', 2);
     * clearNamespace('key+'); //both key+test and key+test2 have been removed.
     *
     * @param namespace the prefix to check for when removing items.
     */
    clearNamespace(namespace) {
        let remove = [];
        for (let i = 0; i < localStorage.length + 5; i++) {
            let key = localStorage.key(i);
            if (key && key.startsWith(namespace)) {
                remove.push(key);
            }
        }
        remove.forEach(key => localStorage.removeItem(key));
    }
}
exports.Storage = Storage;
