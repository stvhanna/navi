import Ember from 'ember';
import Mirage from 'ember-cli-mirage';
import config from 'ember-get-config';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

const SERIALIZED_MODEL =
  'EQbwOsAmCGAu0QFzmAS0kiBGCAaCcsATqgEYCusApgM5IoBuqN50ANqgF5yoD2AdvQiwAngAcqmYB35UAtAGMAFtCKw8EBlSI0-g4Iiz5gAWyrwY8IcGgAPZtZHWa21LWuiJUyKjP9dAhrACgIAZqgA5tZmxKgK0eYk8QYEkADCHAoA1nTAxmKq0DHaucgAvmXGPn4B_ADyRJDaSADaEGJEvBJqTsAAulW-VP56pS0o_EWSKcAACp3dogAEOHma7OTuBigdXdqiUlhYACwQFbgTU1Lzez1LAExBDBtbyO0L-72I2AAMfz-rc6XMzXD53ADMTxepR2YIOMyw_x-j2AFT6FQxlWEqFgbGm32AAAkRERyHilgA5KgAd1yxiIVAAjpsaOpthA2LwInF2AAVaCkPEeAVCmayWDU3hELJBWBDADiRGgqH0BJgvSxpkScTGKBiSSk0HSmRyZwuEH1cSkkwYGTiptRAwg1WGtV1zqGI0CM12iw1TuA4TY1B0rQDKiY_CiBhaAZoUrZiHGFu1yQJNrt2TpHoZCjl3oJ0BoyTKAZVIeebHdwFZqkTEHuAIArHIjnIfgBOJZ_RA9v4AOn-QWGGBmjawLbbWAAbN2fr35wOh47jKRVJAAGolPRSBirelMlmwLc6HczPdnTUMtg8AQ0JSoMQwgiUJRS6yWBDs4CefEQcguKGaxoKO6bQEwAD6AHNKi5zCOIf7AAyYgJrkFTAEAA';

moduleForAcceptance('Acceptance | print report', {
  afterEach() {
    server.shutdown();
  }
});

test('print reports index', function(assert) {
  assert.expect(1);
  visit('/print/reports/1');

  andThen(function() {
    assert.equal(currentURL(), '/print/reports/1/view', 'Redirect to view sub route');
  });
});

test('print reports view', function(assert) {
  assert.expect(3);
  visit('/print/reports/1/view');

  andThen(function() {
    assert.equal(
      find('.navi-report__title')
        .text()
        .trim(),
      'Hyrule News',
      'Should show report title'
    );

    assert.ok(find('.print-report-view__visualization').is(':visible'), 'Should show report visualization');

    assert.notOk(
      find('.print-report-view__visualization-header').is(':visible'),
      'Should not show report visualization header'
    );
  });
});

test('print reports error', function(assert) {
  assert.expect(1);

  server.urlPrefix = `${config.navi.dataSources[0].uri}/v1`;
  server.get('/data/*path', () => {
    return new Mirage.Response(400, {}, { description: 'Cannot merge mismatched time grains month and day' });
  });

  //suppress errors and exceptions for this test
  let originalLoggerError = Ember.Logger.error,
    originalException = Ember.Test.adapter.exception;

  Ember.Logger.error = function() {};
  Ember.Test.adapter.exception = function() {};

  visit('/print/reports/5');
  andThen(() => {
    assert.equal(
      $('.navi-report-error__info-message')
        .text()
        .replace(/\s+/g, ' ')
        .trim(),
      'Oops! There was an error with your request. Cannot merge mismatched time grains month and day',
      'An error message is displayed for an invalid request'
    );

    Ember.Logger.error = originalLoggerError;
    Ember.Test.adapter.exception = originalException;
  });
});

test('print reports invalid', function(assert) {
  assert.expect(1);
  visit('/print/reports/6');

  andThen(function() {
    assert.equal(currentURL(), '/print/reports/6/invalid', 'Redirect to invalid sub route');
  });
});

test('print url provided report', function(assert) {
  assert.expect(2);

  visit(`/print/reports/new?model=${SERIALIZED_MODEL}`);

  andThen(function() {
    assert.equal(
      find('.navi-report__title')
        .text()
        .trim(),
      'Hyrule News',
      'The report title passed through the model query param is visible'
    );

    assert.ok(
      find('.line-chart-widget').is(':visible'),
      'The visualization type passed through the model query param is visible'
    );
  });
});
