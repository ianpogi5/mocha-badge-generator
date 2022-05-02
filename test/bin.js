import {readFile as rf} from 'fs';
import {promisify} from 'util';
import {resolve as pathResolve, dirname, join} from 'path';
import {fileURLToPath} from 'url';
import {execFile as ef} from 'child_process';
import {assert} from 'chai';

const __dirname = dirname(fileURLToPath(import.meta.url));
const binaryPath = pathResolve(__dirname, '../', 'bin', 'mbg.js');
const execFile = promisify(ef);
const readFile = promisify(rf);

describe('Binary', function () {
    this.timeout(10000);
    it('Outputs version', async function () {
        const {version} = JSON.parse(await readFile(join(__dirname, '../package.json')));
        const {stdout, stderr} = await execFile(
            binaryPath,
            ['--version']
        );
        assert.equal(stdout, version + '\n');
        assert.equal(stderr, '');
    });
    it('Builds badge from CLI', async function () {
        const {stdout, stderr} = await execFile(
            binaryPath,
            [
                '--file',
                pathResolve(__dirname, 'fixtures', 'test-report.json'),
                '--badge_output',
                './test/results/badge-cli.svg'
            ]
        );
        assert.equal(stdout, 'Saved to ./test/results/badge-cli.svg\n');
        assert.equal(stderr, '');
        const expected = await readFile('test/fixtures/badge-cli.svg', 'utf8');
        const result = await readFile('test/results/badge-cli.svg', 'utf8');
        assert.equal(result, expected);
    });

    it('Builds badge from CLI with color and stroke color', async function () {
        const {stdout, stderr} = await execFile(
            binaryPath,
            [
                '--file',
                pathResolve(__dirname, 'fixtures', 'test-report.json'),
                '--badge_output',
                './test/results/badge-color.svg',
                '--badge_ko_color',
                'blue,s{red}'
            ]
        );
        assert.equal(stdout, 'Saved to ./test/results/badge-color.svg\n');
        assert.equal(stderr, '');
        const expected = await readFile('test/fixtures/badge-color.svg', 'utf8');
        const result = await readFile('test/results/badge-color.svg', 'utf8');
        assert.equal(result, expected);
    });

    it('Builds badge from CLI with template', async function () {
        const {stdout, stderr} = await execFile(
            binaryPath,
            [
                '--file',
                pathResolve(__dirname, 'fixtures', 'test-report-mbg.json'),
                '--badge_output',
                './test/results/badge-template.svg',
                '--badge_template',
                'Passes: ${passes}; failures: ${failures}; total: ${total}; ' +
                'duration: ${duration}; fast tests: ${speeds.fast}; ' +
                'medium tests: ${speeds.medium}; slow tests: ${speeds.slow}.'
            ]
        );
        assert.equal(stdout, 'Saved to ./test/results/badge-template.svg\n');
        assert.equal(stderr, '');
        const expected = await readFile('test/fixtures/badge-template.svg', 'utf8');
        const result = await readFile('test/results/badge-template.svg', 'utf8');
        assert.equal(result, expected);
    });

    it('Builds badge from CLI with template and `slow`', async function () {
        const {stdout, stderr} = await execFile(
            binaryPath,
            [
                '--slow', '2000',
                '--file',
                pathResolve(__dirname, 'fixtures', 'test-report-mbg.json'),
                '--badge_output',
                './test/results/badge-template-slow.svg',
                '--badge_template',
                'Passes: ${passes}; failures: ${failures}; total: ${total}; ' +
                'duration: ${duration}; fast tests: ${speeds.fast}; ' +
                'medium tests: ${speeds.medium}; slow tests: ${speeds.slow}.'
            ]
        );
        assert.equal(stdout, 'Saved to ./test/results/badge-template-slow.svg\n');
        assert.equal(stderr, '');
        const expected = await readFile('test/fixtures/badge-template-slow.svg', 'utf8');
        const result = await readFile('test/results/badge-template-slow.svg', 'utf8');
        assert.equal(result, expected);
    });

    it(
        'Builds badge from CLI with template and `slow` against mochawesome report',
        async function () {
            const {stdout, stderr} = await execFile(
                binaryPath,
                [
                    '--slow', '2000',
                    '--file',
                    pathResolve(__dirname, 'fixtures', 'mochawesome.json'),
                    '--badge_output',
                    './test/results/badge-mochawesome.svg',
                    '--badge_template',
                    'Passes: ${passes}; failures: ${failures}; total: ${total}; ' +
                    'duration: ${duration}; fast tests: ${speeds.fast}; ' +
                    'medium tests: ${speeds.medium}; slow tests: ${speeds.slow}.'
                ]
            );
            assert.equal(stdout, 'Saved to ./test/results/badge-mochawesome.svg\n');
            assert.equal(stderr, '');
            const expected = await readFile('test/fixtures/badge-mochawesome.svg', 'utf8');
            const result = await readFile('test/results/badge-mochawesome.svg', 'utf8');
            assert.equal(result, expected);
        }
    );

    it('Builds badge from CLI (glob)', async function () {
        const {stdout, stderr} = await execFile(
            binaryPath,
            [
                '--fileGlob',
                'test/fixtures/test-report*.json',
                '--badge_output',
                './test/results/badge-glob.svg'
            ]
        );
        assert.equal(stdout, 'Saved to ./test/results/badge-glob.svg\n');
        assert.equal(stderr, '');
        const expected = await readFile('test/fixtures/badge-glob.svg', 'utf8');
        const result = await readFile('test/results/badge-glob.svg', 'utf8');
        assert.equal(result, expected);
    });
});
