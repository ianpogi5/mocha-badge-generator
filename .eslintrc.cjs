'use strict';
module.exports = {
    env: {
        node: true,
        es6: true
    },
    extends: ['eslint:recommended'],
    overrides: [{
        files: 'test/**',
        env: {
            mocha: true
        }
    }],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022
    }
};
