const fs = require('fs');
const badge = require('badge-up');

function BadgeGenerator(runner, options) {
    return new Promise((resolve, reject) => {
        const {
            badge_subject, badge_ok_color, badge_ko_color,
            badge_format, badge_output
        } = (options && options.reporterOptions) || {};

        let passes = 0;
        let failures = 0;

        runner.on('pass', function() {
            passes++;
        });

        runner.on('fail', function() {
            failures++;
        });

        runner.on('end', function() {
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

            const color = failures > 0 ? koColor : okColor;
            const status = passes + '/' + (passes + failures);

            // Could use `badge.v2.sectionsToData` for more control; see `test`
            //  in `badge-up`
            const sections = [
                subject,
                [status, color]
            ];
            badge.v2(sections).then((output) => {
                if (format === 'png') {
                    output = require('svg2png').sync(output);
                }

                fs.writeFile(foutput, output, writeErr => {
                    if (writeErr) {
                        return reject(writeErr);
                    }
                    resolve();
                });
            }).catch(
                /* istanbul ignore next */
                (err) => {
                    return reject(err);
                }
            );
        });
    });
}

module.exports = BadgeGenerator;
