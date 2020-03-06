const {promisify} = require('util');
const {resolve: pathResolve} = require('path');
const {execFile: ef} = require('child_process');
const {assert} = require('chai');

const binaryPath = pathResolve(__dirname, '../', 'bin', 'mbg.js');
const execFile = promisify(ef);

describe('Binary', function () {
    this.timeout(10000);
    it('Outputs version', async function () {
        const {version} = require('../package.json');
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
                './test/results/badge.svg'

            ]
        );
        assert.equal(stdout, 'Saved to ./test/results/badge.svg\n');
        assert.equal(stderr, '');
    });
});
