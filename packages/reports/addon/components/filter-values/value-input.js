/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Usage:
 *   {{filter-values/value-input
 *       filter=filter
 *       onUpdateFilter=(action 'update')
 *   }}
 */
import Ember from 'ember';
import layout from '../../templates/components/filter-values/value-input';

export default Ember.Component.extend({
  layout,

  /**
   * @property {String} tagName
   * @override
   */
  tagName: '',

  actions: {
    /**
     * @action setValues
     * @param {String} value - single value to be set in filter
     */
    setValue(value) {
      this.attrs.onUpdateFilter({
        values: [value]
      });
    }
  }
});
