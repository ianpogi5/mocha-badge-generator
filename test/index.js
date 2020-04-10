const events = require('events');
const fs = require('fs');
const {assert} = require('chai');
const Suite = require('mocha/lib/suite');
const Test = require('mocha/lib/test');

const BadgeGenerator = require('../');

const makeFailingTest = () => {
    return new Test('Just a failing test', function () {
        throw new Error('failed');
    });
};

const makeTest = (props) => {
    return new Test('Just a test', function () {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, props.duration);
        });
    }).timeout(5000);
};

const makeSuite = async (testObjs) => {
    const tests = testObjs.map((testObj) => {
        return makeTest(testObj);
    });
    const suite = new Suite('Just a suite');
    tests.forEach((test) => {
        suite.addTest(test);
    });
    await Promise.all(tests.map((test) => {
        return new Promise(function(resolve) {
            test.run(() => {
                resolve();
            });
        });
    }));
    return suite;
};

const BADGE = './test/badge.svg';
const BADGE_FAILED = './test/failed.svg';
const BADGE_PASSED = './test/passed.svg';
const BADGE_PNG = './test/badge.png';
const BADGE_PNG_BY_OPTIONS = './test/badge-by-options.png';
// const BADGE_PNG_PASSED = './test/passed.png';
const BADGE_FAILED_BUT_OK_THRESHOLD = './test/fixtures/ok-threshold.svg';
const BADGE_PASSES_BUT_BAD_DURATION = './test/fixtures/bad-duration.svg';

try {
    fs.accessSync(BADGE, fs.constants.R_OK | fs.constants.W_OK);
    fs.unlinkSync(BADGE);
} catch (e) {
    //
}

describe('mocha badge reporter', function() {
    this.timeout(10000);
    it('should register test failed 3/4', async function() {
        const runner = new events.EventEmitter();
        const suite = await makeSuite([
            {duration: 10},
            {duration: 2000},
            {duration: 1000}
        ]);
        return new Promise(function(resolve, reject) {
            new BadgeGenerator(runner)
                .then(() => {
                    const actual = fs.readFileSync(BADGE, 'utf8');
                    const expected = fs.readFileSync(BADGE_FAILED, 'utf8');
                    assert.equal(actual, expected);
                    fs.unlink(BADGE, function() {
                        resolve();
                    });
                })
                .catch(err => {
                    reject(err);
                });
            suite.tests.forEach((test) => {
                runner.emit('pass', test);
            });
            runner.emit('fail', makeFailingTest());
            runner.emit('end');
        });
    });

    it('should register test failed 3/4 but use passing color if higher threshold set', async function() {
        const runner = new events.EventEmitter();
        const suite = await makeSuite([
            {duration: 10},
            {duration: 2000},
            {duration: 1000}
        ]);
        return new Promise(function(resolve, reject) {
            new BadgeGenerator(runner, {reporterOptions: {badge_threshold: 1}})
                .then(() => {
                    const actual = fs.readFileSync(BADGE, 'utf8');
                    const expected = fs.readFileSync(BADGE_FAILED_BUT_OK_THRESHOLD, 'utf8');
                    assert.equal(actual, expected);
                    fs.unlink(BADGE, function() {
                        resolve();
                    });
                })
                .catch(err => {
                    reject(err);
                });
            suite.tests.forEach((test) => {
                runner.emit('pass', test);
            });
            runner.emit('fail', makeFailingTest());
            runner.emit('end');
        });
    });

    it('should register test passed 4/4', async function() {
        const runner = new events.EventEmitter();
        const suite = await makeSuite([
            {duration: 10},
            {duration: 2000},
            {duration: 1000},
            {duration: 500}
        ]);
        return new Promise(function(resolve, reject) {
            new BadgeGenerator(runner)
                .then(() => {
                    const actual = fs.readFileSync(BADGE, 'utf8');
                    const expected = fs.readFileSync(BADGE_PASSED, 'utf8');
                    assert.equal(actual, expected);
                    fs.unlink(BADGE, function() {
                        resolve();
                    });
                })
                .catch(err => {
                    reject(err);
                });

            suite.tests.forEach((test) => {
                runner.emit('pass', test);
            });
            runner.emit('end');
        });
    });

    it('should register test passed 4/4 but indicate as failure due to failing duration threshold', async function() {
        const runner = new events.EventEmitter();
        const suite = await makeSuite([
            {duration: 10},
            {duration: 2000},
            {duration: 1000},
            {duration: 500}
        ]);
        return new Promise(function(resolve, reject) {
            new BadgeGenerator(runner, {reporterOptions: {
                badge_duration_threshold: 3000
            }})
                .then(() => {
                    const actual = fs.readFileSync(BADGE, 'utf8');
                    const expected = fs.readFileSync(BADGE_PASSES_BUT_BAD_DURATION, 'utf8');
                    assert.equal(actual, expected);
                    fs.unlink(BADGE, function() {
                        resolve();
                    });
                })
                .catch(err => {
                    reject(err);
                });

            suite.tests.forEach((test) => {
                runner.emit('pass', test);
            });
            runner.emit('end');
        });
    });

    it('should throw a write error', async function() {
        process.env.MOCHA_BADGE_GEN_OUTPUT = '/invalid/path/badge.svg';
        const runner = new events.EventEmitter();
        const suite = await makeSuite([
            {duration: 1000}
        ]);
        return new Promise(function(resolve, reject) {
            new BadgeGenerator(runner)
                .then(() => {
                    reject(new Error("Shouldn't pass"));
                })
                .catch(() => {
                    assert.ok(true);
                    resolve();
                });

            suite.tests.forEach((test) => {
                runner.emit('pass', test);
            });
            runner.emit('end');

            // restore default
            process.env.MOCHA_BADGE_GEN_OUTPUT = './test/badge.svg';
        });
    });

    it('should output png', async function() {
        process.env.MOCHA_BADGE_GEN_SUBJECT = 'PNG';
        process.env.MOCHA_BADGE_GEN_OK_COLOR = 'blue';
        process.env.MOCHA_BADGE_GEN_KO_COLOR = 'purple';
        process.env.MOCHA_BADGE_GEN_FORMAT = 'png';
        process.env.MOCHA_BADGE_GEN_OUTPUT = './test/badge.png';

        const runner = new events.EventEmitter();
        const suite = await makeSuite([
            {duration: 10},
            {duration: 2000},
            {duration: 1000},
            {duration: 500}
        ]);
        return new Promise(function(resolve, reject) {
            new BadgeGenerator(runner)
                .then(() => {
                    assert.isTrue(fs.existsSync(BADGE_PNG));
                    fs.unlink(BADGE_PNG, function() {
                        resolve();
                    });
                })
                .catch(err => {
                    reject(err);
                });
            suite.tests.forEach((test) => {
                runner.emit('pass', test);
            });
            runner.emit('end');

            // restore default
            process.env.MOCHA_BADGE_GEN_SUBJECT = 'Tests';
            process.env.MOCHA_BADGE_GEN_OK_COLOR = '44cc11';
            process.env.MOCHA_BADGE_GEN_KO_COLOR = 'e05d44';
            process.env.MOCHA_BADGE_GEN_FORMAT = 'svg';
            process.env.MOCHA_BADGE_GEN_OUTPUT = './test/badge.svg';
        });
    });

    it('should output png', async function() {
        const reporterOptions = {
            badge_subject: 'PNG',
            badge_ok_color: 'blue',
            badge_ko_color: 'purple',
            badge_format: 'png',
            badge_output: './test/badge-by-options.png'
        };

        const runner = new events.EventEmitter();
        const suite = await makeSuite([
            {duration: 10},
            {duration: 2000},
            {duration: 1000},
            {duration: 500}
        ]);
        return new Promise(function(resolve, reject) {
            new BadgeGenerator(runner, {reporterOptions})
                .then(() => {
                    assert.isTrue(fs.existsSync(BADGE_PNG_BY_OPTIONS));
                    fs.unlink(BADGE_PNG_BY_OPTIONS, function() {
                        resolve();
                    });
                })
                .catch(err => {
                    reject(err);
                });
            suite.tests.forEach((test) => {
                runner.emit('pass', test);
            });
            runner.emit('end');
        });
    });

    after(async () => {
        const runner = new events.EventEmitter();
        new BadgeGenerator(runner);
        const suite = await makeSuite([
            {duration: 10},
            {duration: 2000},
            {duration: 1000},
            {duration: 500}
        ]);
        suite.tests.forEach((test) => {
            runner.emit('pass', test);
        });
        runner.emit('end');
    });
});
