// Constants
var MINUTE_IN_MS = 1000 * 60;
var HOUR_IN_MS   = MINUTE_IN_MS * 60;
var DAY_IN_MS    = HOUR_IN_MS * 24;
var WEEK_IN_MS   = DAY_IN_MS * 7;

// Calculate an array of sums over the specified periods
var aggregate = function(endDate, numPeriods, periodDurationInMs, series) {
  var iterator = new Date(endDate.getTime() - periodDurationInMs),
      sumByPeriod = [],
      obj = {
        period: iterator,
        sum: 0
      },
      point,
      t;

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

module.exports = {
  aggregate: aggregate,
  MINUTE_IN_MS: MINUTE_IN_MS,
  HOUR_IN_MS: HOUR_IN_MS,
  DAY_IN_MS: DAY_IN_MS,
  WEEK_IN_MS: WEEK_IN_MS
};
