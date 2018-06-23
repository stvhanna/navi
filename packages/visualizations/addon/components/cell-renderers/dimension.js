/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Usage:
 * {{cell-renderers/dimension
 *   data=row
 *   column=column
 *   request=request
 * }}
 */

import Component from '@ember/component';
import layout from '../../templates/components/cell-renderers/dimension';

export default Component.extend({
  layout,

  /**
   * @property {Array} classNames - list of component class names
   */
  classNames: ['table-cell-content', 'dimension']
});
