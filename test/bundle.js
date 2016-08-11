(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Constants
var MINUTE_IN_MS = 1000 * 60;
var HOUR_IN_MS   = MINUTE_IN_MS * 60;
var DAY_IN_MS    = HOUR_IN_MS * 24;
var WEEK_IN_MS   = DAY_IN_MS * 7;

// Calculate an array of sums over the specified periods
var sum = function(endDate, numPeriods, periodDurationInMs, series) {
  var iterator = new Date(endDate.getTime() - periodDurationInMs),
      sumByPeriod = [],
      obj = {
        period: iterator,
        sum: 0
      },
      point,
      t;

  // Do nothing if there's nothing to sum
  if (!series || series.length === 0) {
    return [];
  }

  for (var i = series.length - 1; i >= 0; --i) {
    point = series[i];
    t = point.timestamp;

    // Skip runs that are after the ending date
    if (t >= endDate) {
      continue;
    }

    // Skip runs older than the cutoff
    if (t < endDate - (periodDurationInMs * numPeriods)) {
      break;
    }

    // Account for periods with no data at all
    while (t < iterator) {
      iterator = new Date(iterator.getTime() - periodDurationInMs);
      sumByPeriod.unshift(obj);
      obj = {
        period: iterator,
        sum: 0
      };
    }

    // Add value to the week object
    obj.sum += point.value;
  }
  sumByPeriod.unshift(obj);

  return sumByPeriod;
};

// Calculate an average of values over the specified periods
var average = function(endDate, numPeriods, periodDurationInMs, series) {
  var iterator = new Date(endDate.getTime() - periodDurationInMs),
      averageByPeriod = [],
      period = iterator,
      sum = 0,
      count = 0,
      point,
      t;

  // Do nothing if there's nothing to sum
  if (!series || series.length === 0) {
    return [];
  }

  for (var i = series.length - 1; i >= 0; --i) {
    point = series[i];
    t = point.timestamp;

    // Skip runs that are after the ending date
    if (t >= endDate) {
      continue;
    }

    // Skip runs older than the cutoff
    if (t < endDate - (periodDurationInMs * numPeriods)) {
      break;
    }

    // Account for periods with no data at all
    while (t < iterator) {
      iterator = new Date(iterator.getTime() - periodDurationInMs);
      averageByPeriod.unshift({
        period: period,
        average: (count > 0 ? sum / count : 0)
      });
      period = iterator;
      sum = 0;
      count = 0;
    }

    // Collect data
    sum += point.value;
    count += 1;
  }
  averageByPeriod.unshift({
    period: period,
    average: (count > 0 ? sum / count : 0)
  });

  return averageByPeriod;
};

module.exports = {
  sum: sum,
  average: average,
  MINUTE_IN_MS: MINUTE_IN_MS,
  HOUR_IN_MS: HOUR_IN_MS,
  DAY_IN_MS: DAY_IN_MS,
  WEEK_IN_MS: WEEK_IN_MS
};

},{}],2:[function(require,module,exports){
var Aggregate = require('../index');

QUnit.test( 'Calculate sums over two 48-hour periods', function(assert) {
  var sums = Aggregate.sum(endDate, numPeriods, periodDurationInMs, series);

  assert.deepEqual(sums, [
    {
      period: p1,
      sum: 11
    },
    {
      period: p2,
      sum: 15
    }
  ], 'Passed!');
});

QUnit.test( 'Calculate averages over two 48-hour periods', function(assert) {
  var averages = Aggregate.average(endDate, numPeriods, periodDurationInMs, series);

  assert.deepEqual(averages, [
    {
      period: p1,
      average: 5.5
    },
    {
      period: p2,
      average: 7.5
    }
  ], 'Passed!');
});

QUnit.test( 'Calculate sum over an empty set', function(assert) {
  var sums = Aggregate.sum(endDate, numPeriods, periodDurationInMs, []);

  assert.deepEqual(sums, [], 'Passed!');
});

var endDate = new Date("June 9, 2016 GMT-0000"),
    numPeriods = 2,
    periodDurationInMs = Aggregate.DAY_IN_MS * 2,
    p1 = new Date("June 5, 2016 GMT-0000"),
    p2 = new Date("June 7, 2016 GMT-0000"),
    series = [
      {
        timestamp: new Date("June 1, 2016 GMT-0000"),
        value: 1
      },
      {
        timestamp: new Date("June 2, 2016 GMT-0000"),
        value: 2
      },
      {
        timestamp: new Date("June 3, 2016 GMT-0000"),
        value: 3
      },
      {
        timestamp: new Date("June 4, 2016 GMT-0000"),
        value: 4
      },
      {
        timestamp: new Date("June 5, 2016 GMT-0000"),
        value: 5
      },
      {
        timestamp: new Date("June 6, 2016 GMT-0000"),
        value: 6
      },
      {
        timestamp: new Date("June 7, 2016 GMT-0000"),
        value: 7
      },
      {
        timestamp: new Date("June 8, 2016 GMT-0000"),
        value: 8
      },
      {
        timestamp: new Date("June 9, 2016 GMT-0000"),
        value: 9
      },
      {
        timestamp: new Date("June 10, 2016 GMT-0000"),
        value: 10
      },
      {
        timestamp: new Date("June 11, 2016 GMT-0000"),
        value: 11
      },
      {
        timestamp: new Date("June 12, 2016 GMT-0000"),
        value: 12
      },
    ];

},{"../index":1}]},{},[2]);
