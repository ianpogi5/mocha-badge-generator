const events = require('events');
const fs = require('fs');
const assert = require('chai').assert;

const BadgeGenerator = require('../');

const BADGE = './test/badge.svg';
const BADGE_FAILED = './test/failed.svg';
const BADGE_PASSED = './test/passed.svg';

try {
    fs.accessSync(BADGE, fs.constants.R_OK | fs.constants.W_OK);
    fs.unlinkSync(BADGE);
} catch (e) {}

describe('mocha badge reporter', function() {
    it('should register test failed 3/4', function(done) {
        const runner = new events.EventEmitter();
        new BadgeGenerator(runner);
        runner.emit('pass');
        runner.emit('pass');
        runner.emit('pass');
        runner.emit('fail');
        runner.emit('end');

        const checkFile = () => {
            try {
                fs.accessSync(BADGE, fs.constants.R_OK | fs.constants.W_OK);

                const actual = fs.readFileSync(BADGE, 'utf8');
                const expected = fs.readFileSync(BADGE_FAILED, 'utf8');
                assert.equal(actual, expected);
                fs.unlink(BADGE, function() {
                    done();
                });
            } catch (e) {
                setTimeout(checkFile, 10);
            }
        };
        checkFile();
    });

    it('should register test passed 4/4', function(done) {
        const runner = new events.EventEmitter();
        BadgeGenerator(runner);
        runner.emit('pass');
        runner.emit('pass');
        runner.emit('pass');
        runner.emit('pass');
        runner.emit('end');

        const checkFile = () => {
            try {
                fs.accessSync(BADGE, fs.constants.R_OK | fs.constants.W_OK);

                const actual = fs.readFileSync(BADGE, 'utf8');
                const expected = fs.readFileSync(BADGE_PASSED, 'utf8');
                assert.equal(actual, expected);
                fs.unlink(BADGE, function() {
                    done();
                });
            } catch (e) {
                setTimeout(checkFile, 10);
            }
        };
        checkFile();
    });

    after(() => {
        const runner = new events.EventEmitter();
        BadgeGenerator(runner);
        runner.emit('pass');
        runner.emit('pass');
        runner.emit('end');
    });
});
