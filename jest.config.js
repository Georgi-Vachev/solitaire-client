// You may need to name this file jest.config.mjs
// or set "type": "module" in package.json

/** @type {import('jest').Config} */
export default {
    transform: {
        '^.+\\.js$': 'babel-jest'
    }
};
