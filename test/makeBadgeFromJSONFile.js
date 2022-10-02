import {assert} from 'chai';

import {makeBadgeFromJSONFile} from '../src/makeBadge.cjs';

describe('`makeBadgeFromJSONFile`', function () {
  it('`makeBadgeFromJSONFile` should throw without `file`', function () {
      assert.throws(() => {
          makeBadgeFromJSONFile({});
      });
  });
});
