import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { setupMock, teardownMock } from '../../../helpers/mirage-helper';
import { clickTrigger, nativeMouseUp } from 'ember-power-select/test-support/helpers';
import AgeValues from 'navi-data/mirage/bard-lite/dimensions/age';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';
import config from 'ember-get-config';

const MockFilter = {
  subject: {
    name: 'age',
    storageStrategy: 'loaded',
    primaryKeyFieldName: 'id'
  },
  values: ['1', '2', '3'],
  validations: {}
};

const HOST = config.navi.dataSources[0].uri;

let Mirage;

moduleForComponent('filter-values/dimension-select', 'Integration | Component | filter values/dimension select', {
  integration: true,

  beforeEach: function() {
    this.filter = MockFilter;
    Mirage = setupMock();
    return Ember.getOwner(this)
      .lookup('service:bard-metadata')
      .loadMetadata();
  },

  afterEach: function() {
    teardownMock();
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  this.render(hbs`{{filter-values/dimension-select filter=filter}}`);

  // Open value selector
  clickTrigger();
  return wait().then(() => {
    let selectedValueText = this.$('.ember-power-select-multiple-option span:nth-of-type(2)')
        .map(function() {
          return $(this)
            .text()
            .trim();
        })
        .get(),
      expectedValueDimensions = AgeValues.filter(age => MockFilter.values.includes(age.id));

    assert.deepEqual(
      selectedValueText,
      expectedValueDimensions.map(age => `${age.description} (${age.id})`),
      'Filter value ids are converted into full dimension objects and displayed as selected'
    );

    let optionText = $('.ember-power-select-option')
        .map(function() {
          return $(this)
            .text()
            .trim();
        })
        .get(),
      expectedOptionText = AgeValues.map(age => `${age.description} (${age.id})`);

    /*
     * Since ember-collection is used for rendering the dropdown options,
     * some later options may be cropped from the DOM, so just check the first 10
     */
    optionText.length = 10;
    expectedOptionText.length = 10;

    assert.deepEqual(
      optionText,
      expectedOptionText,
      'Given Age as the filter subject, all age values are present in the value selector'
    );
  });
});

test('no values', function(assert) {
  assert.expect(1);

  Mirage.pretender.map(function() {
    this.get(`${HOST}/v1/dimensions/age/values`, request => {
      if (request.queryParams.filters === 'age|id-in[]') {
        assert.notOk(true, 'dimension-select should not request dimension values when the filter has no values');
      } else {
        return [200, { 'content-type': 'application/javascript' }, '{}'];
      }
    });
  });

  this.filter = {
    subject: { name: 'age', longName: 'Age' },
    values: []
  };

  this.render(hbs`{{filter-values/dimension-select filter=filter}}`);

  assert.equal(
    this.$('input').attr('placeholder'),
    'Age Values',
    'The dimension long name is used as the placeholder text'
  );
});

test('changing values', function(assert) {
  assert.expect(1);

  this.onUpdateFilter = changeSet => {
    assert.deepEqual(
      changeSet.rawValues,
      MockFilter.values.concat(['5']),
      'The newly selected value is added to existing values and given to action'
    );
  };

  this.render(hbs`{{filter-values/dimension-select filter=filter onUpdateFilter=(action onUpdateFilter)}}`);

  // Select a new value
  clickTrigger();
  return wait().then(() => {
    nativeMouseUp($('.ember-power-select-option:contains(25-29)')[0]);
  });

  // Assert handled in action
});

test('error state', function(assert) {
  assert.expect(2);

  this.render(hbs`{{filter-values/dimension-select filter=filter}}`);
  assert.notOk(
    this.$('.filter-values--dimension-select--error').is(':visible'),
    'The input should not have error state'
  );

  this.set('filter.validations', { attrs: { rawValues: { isInvalid: true } } });
  assert.ok(this.$('.filter-values--dimension-select--error').is(':visible'), 'The input should have error state');
});

test('alternative primary key', function(assert) {
  assert.expect(1);
  this.filter = {
    subject: {
      name: 'multiSystemId',
      storageStrategy: 'loaded',
      primaryKeyFieldName: 'key'
    },
    values: ['k1', 'k3'],
    validations: {}
  };

  this.render(hbs`{{filter-values/dimension-select filter=filter}}`);

  return wait().then(() => {
    let selectedValueText = this.$('.ember-power-select-multiple-option span:nth-of-type(2)')
      .toArray()
      .map(el => {
        let text = $(el)
          .text()
          .trim();
        return text.substr(text.lastIndexOf('('));
      });

    assert.deepEqual(selectedValueText, ['(1)', '(3)'], 'Select values by key instead of id');
  });
});
