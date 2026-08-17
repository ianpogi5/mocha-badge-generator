#!/usr/bin/env node

import {cliBasics} from 'command-line-basics';
import {makeBadgeFromJSONFile} from '../src/makeBadge.js';

const optionDefinitions = await cliBasics(
  import.meta.dirname + '/optionDefinitions.js',
  {
    packageJsonPath: import.meta.dirname + '/../package.json'
  }
);

if (!optionDefinitions) { // cliBasics handled
  process.exit(0);
}

const {output} = await makeBadgeFromJSONFile(optionDefinitions);
console.log('Saved to ' + output);
