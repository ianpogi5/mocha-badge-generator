const {assert} = require('chai');

const {makeBadgeFromJSONFile} = require('../src/makeBadge.js');

describe('`makeBadgeFromJSONFile`', function () {
  it('`makeBadgeFromJSONFile` should throw without `file`', function () {
      assert.throws(() => {
          makeBadgeFromJSONFile({});
      });
  });
});
