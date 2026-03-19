"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMultiCloudAuthState = void 0;
const auth_utils_1 = require("./auth-utils");
const generics_1 = require("./generics");

/**
 * Stores authentication state in a cloud database.
 * This implementation is database-agnostic and relies on provided handler functions.
 * 
 * @param {Object} cloudDB - Object containing read, write, and remove methods
 * @param {Function} cloudDB.read - async (id) => data
 * @param {Function} cloudDB.write - async (id, data) => void
 * @param {Function} cloudDB.remove - async (id) => void
 */
const useMultiCloudAuthState = async (cloudDB) => {

    const readData = async (id) => {
        try {
            const data = await cloudDB.read(id);
            if (data) {
                return JSON.parse(JSON.stringify(data), generics_1.BufferJSON.reviver);
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const writeData = async (id, data) => {
        const json = JSON.parse(JSON.stringify(data, generics_1.BufferJSON.replacer));
        await cloudDB.write(id, json);
    };

    const removeData = async (id) => {
        await cloudDB.remove(id);
    };

    const creds = await readData('creds') || (0, auth_utils_1.initAuthCreds)();

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(ids.map(async (id) => {
                        let value = await readData(`${type}-${id}`);
                        data[id] = value;
                    }));
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const key = `${category}-${id}`;
                            tasks.push(value ? writeData(key, value) : removeData(key));
                        }
                    }
                    await Promise.all(tasks);
                }
            }
        },
        saveCreds: async () => {
            return writeData('creds', creds);
        }
    };
};
exports.useMultiCloudAuthState = useMultiCloudAuthState;
