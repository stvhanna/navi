/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Description: The adapter for the Bard dimension model.
 */

import { assert } from '@ember/debug';

import { makeArray } from '@ember/array';
import { inject as service } from '@ember/service';
import { assign } from '@ember/polyfills';
import EmberObject, { get } from '@ember/object';
import config from 'ember-get-config';

const FACT_HOST = config.navi.dataSources[0].uri;

const SUPPORTED_FILTER_OPERATORS = ['in', 'notin', 'startswith', 'contains'];

/**
 * @enum {String} - mapping of dimension field names to URL dimension field names
 */
const URL_FIELD_NAMES = {
  description: 'desc'
};

export default EmberObject.extend({
  /**
   * @property namespace
   */
  namespace: 'v1',

  /**
   * @property {Service} ajax
   */
  ajax: service(),

  /**
   * @property {Service} bard metadata
   */
  bardMetadata: service(),

  /**
   * @property {Array} supportedFilterOperators - List of supported filter operations
   */
  supportedFilterOperators: SUPPORTED_FILTER_OPERATORS,

  /**
   * Returns metadata for dimensionName
   *
   * @method _getDimensionMetadata
   * @private
   * @param {String} dimensionName - name of dimension
   * @returns {Object} metadata object
   */
  _getDimensionMetadata(dimensionName) {
    return get(this, 'bardMetadata').getById('dimension', dimensionName);
  },

  /**
   * Builds the dimension values URL
   * @method _buildUrl
   * @private
   * @param {string} dimension - dimension name
   * @returns {String} dimension value URL string
   */
  _buildUrl(dimension) {
    let host = FACT_HOST,
      namespace = get(this, 'namespace');

    return `${host}/${namespace}/dimensions/${dimension}/values/`;
  },

  /**
   * Builds a filters query string for dimension values request
   *
   * @method _buildFilterQuery
   * @private
   * @param {String} dimension
   * @param {Object} query - filter query object
   * @param {String} query.field - field used to query
   * @param {String} query.operator - valid operators 'contains', 'in'
   * @param {String} query.values
   * @returns {String} filter query string
   */
  _buildFilterQuery(dimension, query) {
    let defaultQueryOptions = {
      field: this._getDimensionMetadata(dimension).get('primaryKeyFieldName'),
      operator: 'in',
      booleanOperation: 'or',
      values: []
    };

    query = assign({}, defaultQueryOptions, query);

    let queryField = get(query, 'field'),
      field = URL_FIELD_NAMES[queryField] || queryField,
      operator = get(query, 'operator'),
      // Build the filters as expected by bard api
      filters = makeArray(get(query, 'values')).map(value => `${dimension}|${field}-${operator}[${value}]`);

    return {
      filters: filters.join(',')
    };
  },

  /**
   * @method all - Makes a request for all values for a given dimension
   * @param {String} dimension - dimension name
   * @param {Object} [options] - options object
   *      Ex: {
   *        page: 1,
   *        perPage: 200,
   *        clientId: 'custom id',
   *        ...
   *      }
   * @returns {Promise} - Promise with the response
   */
  all(dimension, options) {
    return this.find(dimension, undefined, options);
  },

  /**
   * @method findById - Finds a dimension value object by its id
   * @param {String} dimension - dimension name
   * @param {String} value - the value to be looked up
   * @param {Object} [options] - options object
   * @returns {Promise} - Promise with the response
   */
  findById(dimension, value, options) {
    return this.find(dimension, { values: value }, options);
  },

  /**
   * @method find - Uses the url generated using the adapter to make an ajax request
   * @param {String} dimension - dimension name
   * @param {Object} [query] - the filter query object
   * @param {Object} [options] - options object
   *      Ex: {
   *        page: 1,
   *        perPage: 200,
   *        clientId: 'custom id',
   *        ...
   *      }
   * @returns {Promise} - Promise with the response
   */
  find(dimension, query, options) {
    let url = this._buildUrl(dimension),
      filterQuery = {},
      clientId = 'UI',
      timeout = 30000;

    // If filter query is present, build query having the filter
    if (query) {
      filterQuery = this._buildFilterQuery(dimension, query);
    }

    if (options) {
      // Support custom clientid header
      if (options.clientId) {
        clientId = options.clientId;
      }

      // Support custom timeout
      if (options.timeout) {
        timeout = options.timeout;
      }

      // pagination
      if (options.page && options.perPage) {
        filterQuery.page = options.page;
        filterQuery.perPage = options.perPage;
      }
    }

    return get(this, 'ajax').request(url, {
      xhrFields: {
        withCredentials: true
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('clientid', clientId);
      },
      crossDomain: true,
      data: filterQuery,
      timeout: timeout
    });
  },

  /**
   * Pushes an array of dimension records to the web service
   *
   * @method pushMany
   * @param {String} dimension - type name of the dimension
   * @param {Array} rawRecords - array of dimension objects
   * @param {Object} [options] - options object
   * @returns {Array} records that were pushed to the web service
   */
  pushMany(/* dimension, payload, options */) {
    assert('Operation not supported');
  }
});
