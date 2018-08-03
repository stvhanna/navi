/**
 * Copyright 2018, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */
import Component from '@ember/component';
import layout from '../templates/components/power-calendar-months';
import { computed, get } from '@ember/object';
import { run } from '@ember/runloop';
import moment from 'moment';
import { A } from '@ember/array';

export default Component.extend({
  layout,

  months: computed('calendar', 'selected', function() {
    let months = moment.monthsShort();
    return A(months.map((monthName, index) => {
      return this._buildMonth(index, monthName);
    }));
  }),

  _buildMonth(index, monthName, calendar = this.get('calendar')) {
    let date = moment([2018, index]);

    return {
      id: index,
      date: date.toDate(),
      moment: date,
      name: monthName,
      isSelected: this.monthIsSelected(date, calendar)
    };
  },

  thirds: computed('months', function() {
    let months = get(this, 'months'),
        thirds = [],
        third = []; 

    months.forEach((month, index) => {
      third.push(month);
      if(index !== 0 && (index+1) % 3 === 0){
        thirds.push(third);
        third = [];
      }
    });

    return thirds;
  }),

  monthIsSelected(date) {
    return this.get('selected') ? date.isSame(this.get('selected'), 'month') : false;
  },

  _updateFocused(id) {
    this.set('focusedId', id);
  },

  actions: {
    onFocusMonth(month) {
      run.scheduleOnce('actions', this, this._updateFocused, month.id);
    },

    onBlurMonth() {
      run.scheduleOnce('actions', this, this._updateFocused, null);
    },

    selectMonth(month) {
      this.get('onSelect')(month);
    },
  }
});
