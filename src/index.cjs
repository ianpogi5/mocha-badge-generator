'use strict';

const Base = require('mocha/lib/reporters/base');
const {inherits} = require('mocha/lib/utils');

const {makeBadge} = require('./makeBadge.cjs');

function BadgeGenerator(runner, options) {
    // We need the base for its calculation of `test.speed`
    Base.call(this, runner, options);
    this.promise = new Promise((resolve, reject) => {
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

BadgeGenerator.prototype.done = function done (failures, fn) {
    this.promise.then(() => {
        fn(failures);
    }).catch((err) => {
        console.error(err);
    });
};

module.exports = BadgeGenerator;

/**
 * Inherit from `Base.prototype`.
 */
inherits(BadgeGenerator, Base);
