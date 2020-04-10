'use strict';

const getChalkTemplateSingleEscape = (s) => {
  return s.replace(/[{}\\]/gu, (ch) => {
    return `\\u${ch.codePointAt().toString(16).padStart(4, '0')}`;
  });
};

const getChalkTemplateEscape = (s) => {
  return s.replace(/[{}\\]/gu, (ch) => {
    return `\\\\u${ch.codePointAt().toString(16).padStart(4, '0')}`;
  });
};

const getBracketedChalkTemplateEscape = (s) => {
  return '{' + getChalkTemplateEscape(s) + '}';
};

const optionDefinitions = [
    // multiple: true, defaultOption: true
    {
        name: 'file', type: String, multiple: true,
        description: 'The JSON file from which to obtain the ' +
        'passes/fails (on a `stats` property)',
        typeLabel: '{underline file}'
    },
    {
        name: 'fileGlob', type: String, multiple: true,
        description: 'Points to JSON files in format of `file` but as globs',
        typeLabel: '{underline glob}'
    },
    {
        name: 'slow', type: Number,
        description: 'Number of milliseconds that will be considered "slow" ' +
            '(and per Mocha\'s algorithm, more than half of that will be ' +
            'considered "medium"). Defaults to 75 ms per passing test ' +
            '(as with Mocha). Mocha\'s JSON test results do not record ' +
            'this info currently in reports, so test calls to `slow` cannot ' +
            'be taken into account.',
        typeLabel: '{underline ms}'
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
            'Defaults to 44cc11 (brightgreen).' +
            getChalkTemplateSingleEscape(
                'May follow with comma and `s{ffffff}` to add a different ' +
                'stroke color.'
            ),
        typeLabel: getBracketedChalkTemplateEscape(
            'underline CSS-Color|Hex as: ffffff|Hex stroke as s{ffffff}'
        )
    },
    {
        name: 'badge_ko_color', type: String,
        description: 'The color when at least 1 test fails. See ' +
            '`badge_ok_color` for possible colors. Defaults to e05d44 (red).' +
            getChalkTemplateSingleEscape(
                'May follow with comma and `s{ffffff}` to add a different ' +
                'stroke color.'
            ),
        typeLabel: getBracketedChalkTemplateEscape(
            'underline CSS-Color|Hex as: ffffff|Hex stroke as s{ffffff}'
        )
    },
    {
        name: 'badge_template', type: String,
        description: 'ES6 template for formatting the results; will be passed ' +
            '`passes`, `failures`, `total`, `duration`, `speeds` (with ' +
            '`fast`, `medium`, and `slow` property counts). ' +
            getChalkTemplateSingleEscape(
                'Defaults to "${passes}/${total}".'
            ),
        typeLabel: '{underline es6 template string}'
    },
    {
        name: 'badge_output', type: String,
        description: 'Path of the output file. Defaults to "./test/badge.svg"',
        typeLabel: '{underline path}'
    },
    {
        name: 'badge_threshold', type: Number,
        description: 'Number of acceptable failures (such that if exceeded,' +
            '`badge_ko_color` will be used in place of `badge_ok_color`). ' +
            'Defaults to 0.',
        typeLabel: '{underline acceptable failures}'
    },
    {
        name: 'badge_slow_threshold', type: Number,
        description: 'Indicates a maximum number of slow tests beyond which ' +
            'the tests will be considered a failure (such that if the amount ' +
            'is exceeded, `badge_ko_color` will be used in place of ' +
            '`badge_ok_color`). No default as only checked if present.',
        typeLabel: '{underline duration in ms}'
    },
    {
        name: 'badge_duration_threshold', type: Number,
        description: 'Indicates a maximum duration in milliseconds beyond which ' +
            'the tests will be considered a failure (such that if the duration ' +
            'is exceeded, `badge_ko_color` will be used in place of ' +
            '`badge_ok_color`). No default as only checked if present.',
        typeLabel: '{underline duration in ms}'
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
