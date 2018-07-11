import Service from '@ember/service';
import { test } from 'qunit';
import { moduleFor, setupTest } from 'ember-qunit';

moduleFor('helper:navi-get-display-name', 'Unit | Helper | navi get display name', function(hooks) {
  setupTest(hooks);

  test('display name is returned', function(assert) {
    assert.expect(3);

    // Mock metadata service
    const MockMeta = {
      pageViews: { longName: 'Page Views' }
    };
    const MockService = Service.extend({
      getById(type, id) {
        return MockMeta[id];
      }
    });
    this.owner.register('service:bard-metadata', MockService);

    let getDisplayName = this.subject();

    assert.equal(getDisplayName.compute(['metric', 'pageViews']),
      'Page Views',
      'The helper returns the metric longName');

    assert.equal(getDisplayName.compute(['metric', undefined]),
      undefined,
      'Undefined is returned when id is not given');

    assert.throws(() => getDisplayName.compute(['metric', 'notAMetric']),
      /No metric found for id: notAMetric/,
      'An error is given when the id is not found');
  });
});
