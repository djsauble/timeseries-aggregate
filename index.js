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
