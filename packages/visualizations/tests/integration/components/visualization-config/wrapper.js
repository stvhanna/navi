import { run } from '@ember/runloop';
import Component from '@ember/component';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

let Template = hbs`
  {{visualization-config/wrapper
    response=response
    request=request
    visualization=visualization
    onUpdateConfig=(action onUpdateConfig)
  }}`;

module('Integration | Component | visualization config/warpper', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    //mocking viz-config component
    this.owner.register('component:visualization-config/mock',
      Component.extend({
        classNames: [ 'mock' ],
        click(){
          this.get('onUpdateConfig')('foo');
        }
      }), {instantiate: false});

    this.set('visualization', {
      type: 'mock',
      metadata: {}
    });
  });

  test('component renders', async function(assert) {
    assert.expect(2);

    await render(Template);

    assert.ok(this.$('.visualization-config--body .mock').is(':visible'),
      'The Mock component is correctly rendered based on visualization type');

    assert.equal(find('.visualization-config--header').textContent.trim(),
      'Mock',
      'the header displays the type of the visualization config component rendered');
  });

  test('onUpdateConfig', async function(assert) {
    assert.expect(1);

    this.set('onUpdateConfig', result => {
      assert.equal(result,
        'foo',
        'onUpdateConfig action is called by the mock component');
    });

    await render(Template);

    run(async () => {
      await click('.visualization-config--body .mock');
    });
  });
});
