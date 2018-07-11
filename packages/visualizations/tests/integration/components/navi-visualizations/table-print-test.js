import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { startMirage } from 'dummy/initializers/ember-cli-mirage';

const TEMPLATE = hbs`
  {{navi-visualizations/table
    model=model
    options=options
    onUpdateReport=(action onUpdateReport)
  }}`;

const ROWS = [
  {
    'dateTime': '2016-05-30 00:00:00.000',
    'os|id': 'All Other',
    'os|desc': 'All Other',
    'uniqueIdentifier': 172933788,
    'totalPageViews': 3669828357
  },
  {
    'dateTime': '2016-05-30 00:00:00.000',
    'os|id': 'Android',
    'os|desc': 'Android',
    'uniqueIdentifier': 183206656,
    'totalPageViews': 4088487125
  },
  {
    'dateTime': '2016-05-30 00:00:00.000',
    'os|id': 'BlackBerry',
    'os|desc': 'BlackBerry OS',
    'uniqueIdentifier': 183380921,
    'totalPageViews': 4024700302
  },
];

const Model = A([{
  request: {
    dimensions: [ {dimension:'os'} ],
    metrics: [
      {metric: 'uniqueIdentifier'},
      {metric: 'totalPageViews'}
    ],
    logicalTable: {
      table: 'network',
      timeGrain:{
        name: 'day'
      }
    },
  },
  response: {
    rows: ROWS
  }
}]);

const Options = {
  columns: [
    {
      field: {dateTime: 'dateTime'},
      type: 'dateTime',
      displayName: 'Date'
    },
    {
      field: {dimension: 'os'},
      type: 'dimension',
      displayName: 'Operating System'
    },
    {
      field: {metric: 'uniqueIdentifier', parameters: {}},
      type: 'metric',
      displayName: 'Unique Identifiers'
    },
    {
      field: {metric: 'totalPageViews', parameters: {}},
      type: 'metric',
      displayName: 'Total Page Views'
    }
  ]
};

module('Integration | Component | navi visualizations/table print', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.server = startMirage();

    this.set('model', Model);
    this.set('options', Options);
    this.set('onUpdateReport', () => {});

    return this.owner.lookup('service:bard-metadata').loadMetadata();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('it renders', async function(assert) {
    assert.expect(3);

    await render(TEMPLATE);

    assert.ok(this.$('.table-widget').is(':visible'),
      'The table widget component is visible');

    let headers = this.$('.table-header-cell').toArray().map(el => el.textContent.trim());

    assert.deepEqual(headers, [
      'Date',
      'Operating System',
      'Unique Identifiers',
      'Total Page Views'
    ], 'The table renders the headers correctly based on the request');

    let body = this.$('.table-body .table-row' ).toArray().map((row) =>
      this.$(row).find('.table-cell-content').toArray().map((cell) =>
        this.$(cell).text().trim()));

    assert.deepEqual(body, [
      ['05/30/2016','All Other','172,933,788','3,669,828,357'],
      ['05/30/2016','Android','183,206,656','4,088,487,125'],
      ['05/30/2016','BlackBerry OS','183,380,921','4,024,700,302']
    ], 'The table renders the response dataset correctly');
  });
});
