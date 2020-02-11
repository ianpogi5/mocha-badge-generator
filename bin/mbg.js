#!/usr/bin/env node
'use strict';

const {join} = require('path');
const {cliBasics} = require('command-line-basics');
const {makeBadgeFromJSONFile} = require('../src/makeBadge.js');

const optionDefinitions = cliBasics(
  join(__dirname, './optionDefinitions.js')
);

if (!optionDefinitions) { // cliBasics handled
  process.exit();
}

// file, (options)
(async () => {
const {output} = await makeBadgeFromJSONFile(optionDefinitions);
console.log('Saved to ' + output);
})();
