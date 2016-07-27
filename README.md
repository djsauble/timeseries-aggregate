Given an array of timeseries data ordered from oldest to
newest, aggregate the sum of X periods of Y milliseconds 
each, ending at the date given.

Series data is expected to be an array of objects of the
following format:

{
  timestamp: Date,
  value: Number
}

The output is an array of objects of the following format:

{
  period: Date, // The start of the period being sum
  sum: Number   // The sum of values in the period
}

This algorithm is weighted toward sums that favor the end of
the series array (most recent values), as it iterates from 
end to start.

## Usage

    var DateSum = require('../index');

    var endDate = new Date("June 9, 2016 GMT-0000"),
        numPeriods = 2,
        periodDurationInMs = DateSum.DAY_IN_MS * 2,
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

    // Aggregate the two 48-hour periods preceeding June 9th
    DateSum.aggregate(endDate, numPeriods, periodDurationInMs, series);
