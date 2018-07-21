import Controller from '@ember/controller';
import { A as arr } from '@ember/array';
import { setProperties, set, get, computed } from '@ember/object';
import isEqual from 'lodash/isEqual';

export default Controller.extend({
  request: {
    dimensions: [
      { dimension: { name: 'os', longName: 'Operating System' } }
    ]
  },

  visualization: computed('options', function () {
    return {
      type: 'table',
      version: 1,
      metadata: get(this, 'options')
    };
  }),

  //options passed through to the table component
  options: {
    columns: [
      {
        field: { dateTime: 'dateTime' },
        type: 'dateTime',
        displayName: 'Date'
      },
      {
        field: { dimension: 'os' },
        type: 'dimension',
        displayName: 'Operating System'
      },
      {
        field: { metric: 'uniqueIdentifier', parameters: {} },
        type: 'metric',
        displayName: 'Unique Identifiers'
      },
      {
        field: { metric: 'totalPageViews', parameters: {} },
        type: 'metric',
        displayName: 'Total Page Views'
      },
      {
        field: { metric: 'totalPageViewsWoW', parameters: {} },
        type: 'threshold',
        displayName: 'Total Page Views WoW'
      }
    ]
  },

  upsertSort(options) {
    let request = arr(get(this, 'model.firstObject.request'));
    setProperties(request, {
      sort: [{
        metric: options.metric,
        direction: options.direction
      }]
    });
  },

  removeSort() {
    let request = arr(get(this, 'model.firstObject.request'));
    setProperties(request, { sort: [] });
  },

  updateColumn(column) {
    const newColumns = get(this, 'options.columns').map(col => {
      if (isEqual(col.field, column.field)) {
        return column;
      }

      return col;
    });
    set(this, 'options.columns', newColumns);
  },

  updateColumnOrder(newColumnOrder) {
    set(this, 'options.columns', newColumnOrder);
  },

  actions: {
    onUpdateReport(actionType, options) {
      this[actionType](options);
    },

    onUpdateConfig(configUpdate) {
      set(this, 'options',
        $.extend(true, {}, get(this, 'options'), configUpdate));
    }
  }
});