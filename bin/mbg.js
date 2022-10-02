#!/usr/bin/env node

import {fileURLToPath} from 'url';
import {join, dirname} from 'path';
import {cliBasics} from 'command-line-basics';
import {makeBadgeFromJSONFile} from '../src/makeBadge.cjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const optionDefinitions = await cliBasics(
  join(__dirname, './optionDefinitions.js')
);

if (!optionDefinitions) { // cliBasics handled
  process.exit(0);
}

const {output} = await makeBadgeFromJSONFile(optionDefinitions);
console.log('Saved to ' + output);
