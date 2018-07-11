import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { startMirage } from 'dummy/initializers/ember-cli-mirage';

module('helper:default-column-name', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.server = startMirage();

    return this.owner.lookup('service:bard-metadata').loadMetadata();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('dateTime column', async function(assert) {
    const column = { type: 'dateTime' };
    this.set('column', column);

    await render(hbs`{{default-column-name column}}`);

    assert.equal(find('*').textContent.trim(),
      'Date',
      'The default column name for dateTime is Date');
  });

  test('dimension column', async function(assert) {
    const column = { type: 'dimension', field: { dimension: 'os' } };
    this.set('column', column);

    await render(hbs`{{default-column-name column}}`);

    assert.equal(find('*').textContent.trim(),
      'Operating System',
      'The default column name for os dimension is Operating System');
  });

  test('metric column', async function(assert) {
    const column = { type: 'metric', field: { metric: 'totalPageViews' } };
    this.set('column', column);

    await render(hbs`{{default-column-name column}}`);

    assert.equal(find('*').textContent.trim(),
      'Total Page Views',
      'The default column name for totalPageViews metric is Total Page Views');
  });

  test('metric column with parameters', async function(assert) {
    const column = { type: 'metric', field: { metric: 'revenue', parameters: {currency: 'USD'} } };
    this.set('column', column);

    await render(hbs`{{default-column-name column}}`);

    assert.equal(find('*').textContent.trim(),
      'Revenue (USD)',
      'The default column name for revenue metric with currency param of USD is Revenue (USD)');
  });
});
