import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | chart series item', function(hooks) {
  setupRenderingTest(hooks);

  test('Component renders', async function(assert) {
    assert.expect(3);

    this.set('seriesIndex', 0);

    await render(hbs`
          {{#chart-series-item
             seriesIndex=seriesIndex
          }}
              <li class='list'>Foo</li>
          {{/chart-series-item}}
      `);

    assert.ok(this.$('.chart-series-item').is(':visible'),
      'Chart Series component is rendered');

    assert.equal(find('.chart-series-item .series-header').textContent.trim(),
      'Series 1',
      'Chart series has header as "Series 1"');

    assert.equal(find('.chart-series-item .list').textContent.trim(),
      'Foo',
      'The element in the yield block is rendered');
  });
});
