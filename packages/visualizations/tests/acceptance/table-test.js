import { click, fillIn, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers';

module('Acceptance | table', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /table', async function(assert) {
    assert.expect(2);

    await visit('/table');

    assert.deepEqual(find('.table-header-cell__title').toArray().map(el => el.textContent.trim()),[
      'Date',
      'Operating System',
      'Unique Identifiers',
      'Total Page Views',
      'Total Page Views WoW'
    ], 'The headers for the table are as specified');
    
    reorder(
      'mouse',
      '.table-header-cell',
      '.dimension:contains(Operating System)',
      '.dateTime',
      '.metric:contains(Unique Identifiers)',
      '.metric:contains(Total Page Views)',
      '.threshold:contains(Total Page Views WoW)'
    );
    
    assert.deepEqual(find('.table-header-cell__title').toArray().map(el => el.textContent.trim()),[
      'Operating System',
      'Date',
      'Unique Identifiers',
      'Total Page Views',
      'Total Page Views WoW'
    ], 'The headers are reordered as specified by the reorder');
  });

  test('toggle table editing', async function(assert) {
    assert.expect(6);

    await visit('/table');
    assert.notOk(find('.table-header-cell__input').is(':visible'), 'Table header edit field should not be visible');

    await click('.table-config__total-toggle-button .x-toggle-btn');
    assert.ok(find('.table-header-cell__input').is(':visible'), 'Table header edit field should be visible');

    assert.notOk(find('.dateTime .number-format-dropdown__trigger').is(':visible'), 'Datetime field should not have format dropdown trigger');

    assert.notOk(find('.dimension .number-format-dropdown__trigger').is(':visible'), 'Dimension field should not have format dropdown trigger');

    assert.ok(find('.metric .number-format-dropdown__trigger').is(':visible'), 'Metric field should have format dropdown trigger');

    clickTrigger();
    assert.ok(find('.number-format-dropdown__container').is(':visible'), 'Table format dropdown should be visible');
  });

  test('edit table field', async function(assert) {
    assert.expect(2);

    await visit('/table');

    await click('.table-config__total-toggle-button .x-toggle-btn');
    await fillIn('.dateTime > .table-header-cell__input', 'test');
    await click('.table-config__total-toggle-button .x-toggle-btn');

    assert.equal(find('.dateTime > .table-header-cell__title').textContent.trim(),
      'test',
      'DateTime field should have custom name "test"');

    assert.ok(find('.dateTime > .table-header-cell__title').classList.contains('table-header-cell__title--custom-name'),
      'DateTime field should have custom name class after editing');
  });

  test('edit table field - empty title', async function(assert) {
    assert.expect(2);

    await visit('/table');

    await click('.table-config__total-toggle-button .x-toggle-btn');
    await fillIn('.dateTime > .table-header-cell__input', null);
    await click('.table-config__total-toggle-button .x-toggle-btn');

    assert.equal(find('.dateTime > .table-header-cell__title').textContent.trim(),
      'Date',
      'DateTime field should have the default name "Date"');

    assert.notOk(find('.dateTime').classList.contains('custom-name'),
      'DateTime field should not have custom name class after removing title');
  });
});
