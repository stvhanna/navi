/**
 * Copyright 2018, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Usage:
 *  {{visualization-config/goal-gauge
 *    request=request
 *    response=response
 *    options=options
 *  }}
 */
import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { get } from '@ember/object';
import layout from '../../templates/components/visualization-config/goal-gauge';

export default Component.extend({
  /**
   * @property {Object} layout
   */
  layout,

  /**
   * @property {Array} classNames
   */
  classNames: ['goal-gauge-config'],

  /**
   * @property {object} metric fragment
   */
  metricModel: alias('request.metrics.firstObject'),

  actions: {
    /**
     * @action updateConfig
     */
    updateConfig(type, value) {
      get(this, 'onUpdateConfig')({ [type]: value });
    },
  }
});
