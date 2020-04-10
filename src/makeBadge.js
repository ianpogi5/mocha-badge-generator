const fs = require('fs');
const {resolve: pathResolve} = require('path');
const badge = require('badge-up').v2;
const es6Template = require('es6-template-strings');

const fastGlob = require('fast-glob');

async function makeBadge ({
    passes, failures,
    duration, speeds,
    options
}) {
    const {
        badge_subject, badge_ok_color, badge_ko_color,
        badge_format, badge_output, badge_template,
        badge_threshold, badge_duration_threshold
    } = options || {};
    const subject = badge_subject ||
        process.env.MOCHA_BADGE_GEN_SUBJECT || 'Tests';
    const okColor = badge_ok_color ||
        process.env.MOCHA_BADGE_GEN_OK_COLOR || '44cc11'; // Bright green
    const koColor = badge_ko_color ||
        process.env.MOCHA_BADGE_GEN_KO_COLOR || 'e05d44'; // Red
    const foutput = badge_output ||
        process.env.MOCHA_BADGE_GEN_OUTPUT || './test/badge.svg';
    const format = badge_format ||
        process.env.MOCHA_BADGE_GEN_FORMAT || 'svg';
    const textTemplate = badge_template ||
        process.env.MOCHA_BADGE_GEN_TEMPLATE || '${passes}/${total}';
    const failureThreshold = badge_threshold ||
        process.env.MOCHA_BADGE_GEN_THRESHOLD || 0;
    const durationThreshold = badge_duration_threshold ||
        process.env.MOCHA_BADGE_GEN_DURATION_THRESHOLD;

    const color = failures > failureThreshold ||
        (durationThreshold && duration > durationThreshold)
        ? koColor
        : okColor;
    const total = passes + failures;

    // Could use `badge.v2.sectionsToData` for more control; see `test`
    //  in `badge-up`
    const sections = [
        subject,
        [es6Template(textTemplate, {
            passes,
            failures,
            total,
            duration,
            speeds
        }), ...color.split(',')]
    ];
    let output = await badge(sections);
    if (format === 'png') {
        output = require('svg2png').sync(output);
    }

    return new Promise((resolve, reject) => {
        fs.writeFile(foutput, output, writeErr => {
            if (writeErr) {
                return reject(writeErr);
            }
            resolve({
                output: foutput
            });
        });
    });
}

exports.makeBadgeFromJSONFile = (options) => {
    if (
        (!options.fileGlob || !options.fileGlob.length) &&
        (!options.file || !options.file.length)
    ) {
        throw new TypeError('You must supply a `file` (or `fileGlob`) to `makeBadgeFromJSONFile`');
    }

    const {
        // Use default from Mocha `Runnable`
        slow = 75
    } = options;

    // Adapting algorithm from `mocha/lib/reporters/base.js`; would seem
    //  inefficient to run a test with reporter to get at this info,
    //  especially with a simple algorithm.
    function baseReporterPassSpeedCalculation (obj, duration, tests) {
        tests.forEach(({duration}) => {
            if (duration > slow) {
              obj.speeds.slow++;
            } else if (duration > slow / 2) {
              obj.speeds.medium++;
            } else {
              obj.speeds.fast++;
            }
        });
    }
    // Throw early above
    return (async () => {
        if (options.fileGlob && options.fileGlob.length) {
            options.file = options.file || [];
            options.file.push(...await fastGlob(options.fileGlob));
        }
        const {
            passes, failures, duration, speeds
        } = options.file.reduce((obj, file) => {
            const data = require(pathResolve(process.cwd(), file));
            const {
                stats: {passes, failures, duration},
                tests,
                results: mochawesomeTestResults
            } = data;
            obj.passes += passes;
            obj.failures += failures;
            obj.duration += duration;
            let testResults = tests;
            if (!tests && mochawesomeTestResults) {
                testResults = [];
                const flattenResults = (results) => {
                    results.forEach((result) => {
                        result.tests.forEach((test) => {
                            testResults.push(test);
                        });
                        flattenResults(result.suites);
                    });
                };
                flattenResults(mochawesomeTestResults);
            }
            baseReporterPassSpeedCalculation(obj, duration, testResults);
            return obj;
        }, {passes: 0, failures: 0, duration: 0, speeds: {
            fast: 0,
            slow: 0,
            medium: 0
        }});
        return makeBadge({passes, failures, options, duration, speeds});
    })();
};

exports.makeBadge = makeBadge;
