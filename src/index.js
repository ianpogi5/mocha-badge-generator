const Base = require('mocha/lib/reporters/base');
const {inherits} = require('mocha/lib/utils');

const {makeBadge} = require('./makeBadge.js');

function BadgeGenerator(runner, options) {
    // We need the base for its calculation of `test.speed`
    Base.call(this, runner, options);
    return new Promise((resolve, reject) => {
        let passes = 0;
        let failures = 0;

        let duration = 0;
        const speeds = {
            fast: 0,
            slow: 0,
            medium: 0
        };

        runner.on('pass', function(test) {
            duration += test.duration;
            speeds[test.speed]++;
            passes++;
        });

        runner.on('fail', function() {
            failures++;
        });

        runner.on('end', function() {
            makeBadge({
                passes,
                failures,
                duration,
                speeds,
                options: options && options.reporterOptions
            }).then(resolve, reject);
        });
    });
}

module.exports = BadgeGenerator;

/**
 * Inherit from `Base.prototype`.
 */
inherits(BadgeGenerator, Base);
