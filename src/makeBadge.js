const fs = require('fs');
const {resolve: pathResolve} = require('path');
const badge = require('badge-up').v2;

const fastGlob = require('fast-glob');

async function makeBadge ({passes, failures, options}) {
    const {
        badge_subject, badge_ok_color, badge_ko_color,
        badge_format, badge_output
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

    const color = failures > 0 ? koColor : okColor;
    const status = passes + '/' + (passes + failures);

    // Could use `badge.v2.sectionsToData` for more control; see `test`
    //  in `badge-up`
    const sections = [
        subject,
        [status, color]
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
    // Throw early above
    return (async () => {
        if (options.fileGlob && options.fileGlob.length) {
            options.file = options.file || [];
            options.file.push(...await fastGlob(options.fileGlob));
        }
        const {passes, failures} = options.file.reduce((obj, file) => {
            const {
                stats: {passes, failures}
            } = require(pathResolve(process.cwd(), file));
            obj.passes += passes;
            obj.failures += failures;
            return obj;
        }, {passes: 0, failures: 0});
        return makeBadge({passes, failures, options});
    })();
};

exports.makeBadge = makeBadge;
