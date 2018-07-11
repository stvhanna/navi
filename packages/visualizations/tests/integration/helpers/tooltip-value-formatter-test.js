import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('helper:tooltip-value-formatter', function(hooks) {
  setupRenderingTest(hooks);

  test('makes a call to smart-format-number by default', async function(assert) {
    assert.expect(4);

    this.set('inputValue', '1234');
    this.set('metricName', 'testric');
    this.set('row', {});

    await render(hbs`{{tooltip-value-formatter inputValue metricName row}}`);

    assert.equal(find('*').textContent.trim(),
      '1,234',
      'Formatted number is returned');

    this.set('inputValue', null);

    assert.equal(find('*').textContent.trim(),
      '',
      'null returns empty string');

    this.set('inputValue', undefined);

    assert.equal(find('*').textContent.trim(),
      '',
      'undefined returns empty string');

    this.set('inputValue', '');

    assert.equal(find('*').textContent.trim(),
      '',
      'empty string returns empty string');
  });
});
