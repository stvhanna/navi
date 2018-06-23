/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * {{visualization-config/line-chart
 *    request=request
 *    response=response
 *    options=chartOptions
 *    onUpdateConfig=(action 'onUpdateChartConfig')
 * }}
 */

import Component from '@ember/component';

import { set, get } from '@ember/object';
import { copy } from '@ember/object/internals';
import layout from '../../templates/components/visualization-config/line-chart';

export default Component.extend({
  layout,

  /**
   * @property classNames
   */
  classNames: ['line-chart-config'],

  /**
   * @property {String} typePrefix - prefix for the line chart component
   */
  typePrefix: 'visualization-config/chart-type/',

  actions: {
    /**
     * Method to replace the seriesConfig in visualization config object.
     *
     * @method onUpdateConfig
     * @param {Object} seriesConfig
     */
    onUpdateConfig(seriesConfig) {
      let newOptions = copy(get(this, 'options'));
      set(newOptions, 'axis.y.series.config', seriesConfig);
      get(this, 'onUpdateConfig')(newOptions);
    }
  }
});
