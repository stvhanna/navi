/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Usage:
 *   {{filter-values/multi-value-input
 *       filter=filter
 *       onUpdateFilter=(action 'update')
 *   }}
 */
import Ember from 'ember';
import layout from '../../templates/components/filter-values/multi-value-input';

const { get, set } = Ember;

export default Ember.Component.extend({
  layout,

  /**
   * @method init
   * @override
   */
  init() {
    this._super(...arguments);
    set(this, 'tags', []);
  },

  /**
   * @property {String} tagName
   * @override
   */
  tagName: '',

  actions: {
    /**
     * @action addValue
     * @param {String} value - Add single value to the filter values list
     */
    addValue(tag) {
      let tags = get(this, 'tags');
      tags.push(tag);

      this.attrs.onUpdateFilter({
        rawValues: tags.slice()
      });
    },

    /**
     * @action removeValueAtIndex
     * @param {String} value - Removes a single value from the filter values list
     */
    removeValueAtIndex(index) {
      let tags = get(this, 'tags');
      tags.splice(index, 1);

      this.attrs.onUpdateFilter({
        rawValues: tags.slice()
      });
    }
  }
});
