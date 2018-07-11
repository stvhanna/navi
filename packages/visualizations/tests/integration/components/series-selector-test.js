import { A } from '@ember/array';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';

const TEMPLATE = hbs`
    {{series-selector
        availableSeriesData=availableSeriesData
        seriesDimensions=seriesDimensions
        selectionIndex=14
        searchTermDelay=0
        disableAdd=disableAdd
        addSeries=(action addSeries)
    }}
`;

const AVAILABLE_SERIES_DATA = A([{
  searchKey: '10 10 - 20 safari_mobile Safari Mobile',
  dimensions: [
    {
      dimension: { longName: 'Age' },
      value: { id: '10', description: '10 - 20' }
    },
    {
      dimension: { longName: 'Browser' },
      value: { id: 'safari_mobile', description: 'Safari Mobile' }
    }
  ]
}, {
  searchKey: '20 20 - 30 chrome Chrome',
  dimensions: [
    {
      dimension: { longName: 'Age' },
      value: { id: '20', description: '20 - 30' }
    },
    {
      dimension: { longName: 'Browser' },
      value: { id: 'chrome', description: 'Chrome' }
    }
  ]
}, {
  searchKey: '20 20 - 30 firefox Firefox',
  dimensions: [
    {
      dimension: { longName: 'Age' },
      value: { id: '20', description: '20 - 30' }
    },
    {
      dimension: { longName: 'Browser' },
      value: { id: 'firefox', description: 'Firefox' }
    }
  ]
}
]);

const SERIES_DIMENSIONS = A(AVAILABLE_SERIES_DATA[0].dimensions).mapBy('dimension');

module('Integration | Component | series selector', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.setProperties({
      availableSeriesData: AVAILABLE_SERIES_DATA,
      seriesDimensions: SERIES_DIMENSIONS,
      addSeries: () => null
    });
  });

  test('It renders correctly', async function(assert) {
    assert.expect(2);

    await render(TEMPLATE);

    $('.add-series .btn-add').click();

    let header = $('.table-header .table-cell:not(.table-cell--icon)').toArray().map((el) =>  {
      return el.textContent.trim();
    });

    assert.deepEqual(header, [
      "Age",
      "Browser"
    ], 'table header is correctly displayed based on seriesDimensions');

    let body = $('.table-body .table-cell:not(.table-cell--icon)').toArray().map((el) =>  {
      return el.textContent.trim();
    });

    assert.deepEqual(body, [
      "10 - 20 (10)", "Safari Mobile (safari_mobile)",
      "20 - 30 (20)", "Chrome (chrome)",
      "20 - 30 (20)", "Firefox (firefox)",
    ], 'table body is correctly displayed based on availableSeriesData');
  });


  test('No available series', async function(assert) {
    assert.expect(1);

    this.set('availableSeriesData', []);

    this.set('addSeries', () => {
      assert.ok(false, 'clicking on the message should not trigger the action');
    });

    await render(TEMPLATE);

    $('.add-series .btn-add').click();

    let body = $('.table-body .table-cell').toArray().map((el) =>  {
      return el.textContent.trim();
    });

    assert.deepEqual(body, [
      'No Other Series Available',
    ], 'table body displays messages that no series are available');

    //Try to click msg
    this.$('.table-body .table-row:first').click();
  });

  test('disableAdd', async function(assert) {
    assert.expect(2);

    await render(TEMPLATE);

    assert.notOk($('.add-series .pick-value').hasClass('disableClick'),
      'when enabled "Add Series" button is not disabled"');

    this.set('disableAdd', true);

    assert.ok($('.add-series .pick-value').hasClass('disableClick'),
      'when disabled "Add Series" button is disabled"');
  });

  test('addSeries Action', async function(assert) {
    assert.expect(1);

    this.set('addSeries', (series) => {
      assert.deepEqual(series,
        AVAILABLE_SERIES_DATA[0],
        'clicking on a table body row sends the selected series');
    });

    await render(TEMPLATE);

    $('.add-series .btn-add').click();
    this.$('.table-body .table-row:first').click();
  });
});
