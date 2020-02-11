const {makeBadge} = require('./makeBadge.js');

function badgeGenerator(runner, options) {
    return new Promise((resolve, reject) => {
        let passes = 0;
        let failures = 0;

        runner.on('start', function() {});

        runner.on('pass', function() {
            passes++;
        });

        runner.on('fail', function() {
            failures++;
        });

        runner.on('end', function() {
            makeBadge({
                passes,
                failures,
                options: options && options.reporterOptions
            }).then(resolve, reject);
        });
    });
}

module.exports = badgeGenerator;
