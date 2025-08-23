import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: globals.node
        }
    },
    {
        files: ['test/**'],
        languageOptions: {
            globals: {
                ...globals.mocha,
                ...globals.node
            }
        }
    }
];
