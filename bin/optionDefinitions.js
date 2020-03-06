'use strict';

const optionDefinitions = [
    // multiple: true, defaultOption: true
    {
        name: 'file', type: String,
        description: 'The JSON file from which to obtain the ' +
        'passes/fails (on a `stats` property)',
        typeLabel: '{underline file}'
    },
    {
        name: 'badge_subject', type: String,
        description: 'The text that appears the left side of the badge. Defaults to `Tests`',
        typeLabel: '{underline subject}'
    },
    {
        name: 'badge_ok_color', type: String,
        description: 'The color when all tests pass. Colors may be a ' +
            '6-digit hex code (without the `#`) or a named CSS color. ' +
            'Defaults to 44cc11 (brightgreen).',
        typeLabel: '{underline 6-digit-hex OR named CSS color}'
    },
    {
        name: 'badge_ko_color', type: String,
        description: 'The color when at least 1 test fails. See ' +
            '`badge_ok_color` for possible colors. Defaults to e05d44 (red)',
        typeLabel: '{underline 6-digit-hex OR named CSS color}'
    },
    {
        name: 'badge_output', type: String,
        description: 'Path of the output file. Defaults to "./test/badge.svg"',
        typeLabel: '{underline path}'
    },
    {
        name: 'badge_format', type: String,
        description: 'Output file format. Possible values are "svg" and ' +
            '"png". However, please note that for format "png", you must ' +
            'add `svg2png` yourself (e.g., to your `dependencies` or ' +
            '`devDependencies`). Defaults to "svg"',
        typeLabel: '{underline "svg"|"png"}'
    }
];

const cliSections = [
  {
    // Add italics: `{italic textToItalicize}`
    // content: '' // We get this automatically from `package.json` by default
  },
  {
    optionList: optionDefinitions
  }
];

exports.definitions = optionDefinitions;
exports.sections = cliSections;
