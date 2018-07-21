import $ from 'jquery';
import { getOwner } from '@ember/application';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import config from 'ember-get-config';
import { startMirage } from 'dummy/initializers/ember-cli-mirage';
import {
  clickTrigger as toggleSelector,
  nativeMouseUp as toggleOption
} from '../../../helpers/ember-power-select';

module('Integration | Component | visualization config/table', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.server = startMirage();
    return this.owner.lookup('service:bard-metadata').loadMetadata();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('it renders', async function(assert) {
    assert.expect(1);

    await render(hbs`{{visualization-config/table}}`);

    assert.equal(find('.table-config').textContent.trim(),
      'You can access more configuration in each of the column headers',
      'Table Configuration Component displays the warning message');
  });

  test('table config - feature flag set', async function(assert) {
    assert.expect(5);

    let originalFlag = config.navi.FEATURES.enableTotals;
    config.navi.FEATURES.enableTotals = true;

    this.set('onUpdateConfig', () => {});
    this.set('request', {
      dimensions: [{ dimension: 'os' }, { dimension: 'age' }]
    });
    await render(hbs`{{visualization-config/table
      request=request
      onUpdateConfig=(action onUpdateConfig)
    }}`);

    assert.equal(find('.table-config__header').textContent.trim(),
      'Totals',
      'The header text is displayed correctly');

    assert.deepEqual(this.$('.table-config__totals-toggle-label').toArray().map(el => el.textContent.trim()), [
      'Grand Total', 'Subtotal'
    ], 'The totals toggle is displayed when the feature flag is set');

    assert.equal(findAll('.table-config__total-toggle-button.x-toggle-component').length,
      2,
      'Two toggle buttons are displayed next to the labels');

    assert.notOk(this.$('.table-config__total-toggle-button--grand-total.x-toggle-component .x-toggle-container-checked').is(':visible'),
      'The toggle buttons are unchecked by default');

    this.set('onUpdateConfig', result => {
      assert.ok(result.showTotals.grandTotal,
        'Clicking the button toggles and sends the flag `showGrandTotal` to `onUpdateConfig`');
    });
    await click('.table-config__total-toggle-button--grand-total .x-toggle-btn');

    config.navi.FEATURES.enableTotals = originalFlag;
  });

  test('table config - grandTotal flag option set', async function(assert) {
    assert.expect(1);

    let originalFlag = config.navi.FEATURES.enableTotals;
    config.navi.FEATURES.enableTotals = true;

    await render(hbs`{{visualization-config/table
      options=options
    }}`);

    this.set('options', { showTotals: { grandTotal: true }});

    assert.ok(this.$('.table-config__total-toggle-button--grand-total.x-toggle-component .x-toggle-container-checked').is(':visible'),
      'The grand total toggle button is checked when the flag in options is set');

    config.navi.FEATURES.enableTotals = originalFlag;
  });

  test('table config - subtotal', async function(assert) {
    assert.expect(5);

    let originalFlag = config.navi.FEATURES.enableTotals;
    config.navi.FEATURES.enableTotals = true;

    this.set('request', {});
    this.set('options', { showTotals: { grandTotal: true }});
    this.set('onUpdateConfig', () => {});

    await render(hbs`{{visualization-config/table
      request=request
      options=options
      onUpdateConfig=(action onUpdateConfig)
    }}`);

    assert.notOk(this.$('.table-config__total-toggle-button--subtotal').is(':visible'),
      'The subtotal toggle is not visible when there are no dimension groupbys');

    this.set('request', {
      dimensions: [
        { dimension: { name: 'os',  longName: 'Operating System' }},
        { dimension: { name: 'age', longName: 'Age' }}
      ]
    });

    this.set('onUpdateConfig', result => {
      assert.equal(result.showTotals.subtotal,
        'dateTime',
        '`dateTime` is used to subtotal when toggled on and updated using `onUpdateConfig`');
    });

    //click the subtotal toggle
    await click('.table-config__total-toggle-button--subtotal .x-toggle-btn');

    assert.ok(this.$('.table-config__subtotal-dimension-select').is(':visible'),
      'The dimension dropdown is visible when subtotal is toggled on');

    this.set('onUpdateConfig', result => {
      assert.equal(result.showTotals.subtotal,
        'age',
        'Choosing another option in the dimension select updates the subtotal in the config');
    });

    toggleSelector('.table-config__subtotal-dimension-select');
    toggleOption($('.subtotal-dimension-select__options .ember-power-select-option:contains(Age)')[0]);

    //toggle off subtotal
    await click('.table-config__total-toggle-button--subtotal .x-toggle-btn');

    assert.notOk(this.$('.table-config__subtotal-dimension-select').is(':visible'),
      'The dimension dropdown is hidden when subtotal is toggled off');

    config.navi.FEATURES.enableTotals = originalFlag;
  });

  test('table config - subtotal flag option set', async function(assert) {
    assert.expect(2);

    let originalFlag = config.navi.FEATURES.enableTotals;
    config.navi.FEATURES.enableTotals = true;

    let request = {
      dimensions: [
        { dimension: { name: 'os',  longName: 'Operating System' }},
        { dimension: { name: 'age', longName: 'Age' }}
      ]
    };

    this.set('request', request);

    await render(hbs`{{visualization-config/table
      request=request
      options=options
    }}`);

    this.set('options', { showTotals: { subtotal: 'os' }});

    assert.ok(this.$('.table-config__total-toggle-button--subtotal.x-toggle-component .x-toggle-container-checked').is(':visible'),
      'The subtotal toggle button is checked when the flag in options has a value');

    assert.equal(find('.table-config__subtotal-dimension-select').textContent.replace(/\s+/g, " ").trim(),
      'by Operating System',
      'The selected dimension is set when subtotal in options has a value');

    config.navi.FEATURES.enableTotals = originalFlag;
  });
});
