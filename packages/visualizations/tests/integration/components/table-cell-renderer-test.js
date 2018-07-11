import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | table cell renderer', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders the correct cell renderer', async function(assert) {
    this.set('column', {
      field: {metric: 'foo', parameters: {}},
      type: 'metric'
    });

    this.set('data', {
      foo: 12
    });

    this.set('request', {});

    await render(hbs`{{table-cell-renderer
      column=column
      data=data
      request=request
     }}`);

    assert.equal(find('.table-cell-content').textContent.trim(),
      '12.00',
      'renders metric value');
    assert.ok(find('.table-cell-content').classList.contains('metric'), 'renders metric cell-formatter');

    this.set('column', {
      field: {dimension: 'foo'},
      type: 'dimension'
    });

    this.set('data', {
      'foo|id': 'hi'
    });

    assert.equal(find('.table-cell-content').textContent.trim(),
      'hi',
      'renders dimension value');
    assert.ok(find('.table-cell-content').classList.contains('dimension'), 'renders using dimension cell-formatter');

    this.set('column', {
      type: 'date-time'
    });

    this.set('data', {
      'dateTime': '2012-05-12T00:00:00'
    });

    this.set('request', {
      logicalTable: {
        timeGrain: 'day'
      }
    });

    assert.equal(find('.table-cell-content').textContent.trim(),
      '05/12/2012',
      'renders date-time value');
    assert.ok(find('.table-cell-content').classList.contains('date-time'), 'renders using date-time cell-formatter');

    this.set('column', {
      field: {metric: 'foo', parameters: {}},
      type: 'threshold'
    });

    this.set('data', {
      'foo': 12
    });

    this.set('request', {
      logicalTable: {
        timeGrain: 'day'
      }
    });

    assert.equal(find('.table-cell-content').textContent.trim(),
      '12',
      'renders threshold value');
    assert.ok(find('.table-cell-content').classList.contains('threshold'), 'renders using threshold cell-formatter');
  });
});
