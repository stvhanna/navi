import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  author: belongsTo('user', { inverse: 'dashboards' }),
  widgets: hasMany('dashboard-widget', { inverse: 'dashboard' }),
  deliveryRules: hasMany('delivery-rule', { inverse: 'deliveredItem' })
});
