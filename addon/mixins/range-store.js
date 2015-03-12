import Ember from 'ember';
import CalendarTools from 'ember-cli-cal/utilities/calendartools';
var component;

component = Ember.Mixin.create({
  fetchedRanges: [],
  isRangeFetched: function(range) {
    var fetchedRange, i, len, ref;
    ref = this.get('fetchedRanges');
    for (i = 0, len = ref.length; i < len; i++) {
      fetchedRange = ref[i];
      if (range.start.isSame(fetchedRange.start) || range.start.isAfter(fetchedRange.start)) {
        if (range.end.isSame(fetchedRange.end) || range.end.isBefore(fetchedRange.end)) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  },
  aggregateRange: function(rangeB) {
    var fetchedRanges, i, len, newRanges, rangeA, rangeBPushed;
    fetchedRanges = this.get('fetchedRanges');
    if (fetchedRanges.length === 0) {
      this.set('fetchedRanges', [rangeB]);
      return;
    }
    fetchedRanges.sort(function(a, b) {
      return a.start.isAfter(b.start);
    });
    newRanges = [];
    rangeBPushed = false;
    for (i = 0, len = fetchedRanges.length; i < len; i++) {
      rangeA = fetchedRanges[i];
      if (rangeB.start.isAfter(rangeA.end)) {
        newRanges.push(rangeB);
        continue;
      } else {
        if (rangeB.end.isSame(rangeA.start)) {
          newRanges.push(new CalendarTools.Range({
            start: rangeB.start.clone(),
            end: rangeA.end.clone()
          }));
          rangeBPushed = true;
          continue;
        }
        if (rangeB.end.isBefore(rangeA.start)) {
          newRanges.push(rangeB);
          newRanges.push(rangeA);
          rangeBPushed = true;
          continue;
        }
        if (rangeB.end.isBefore(rangeA.end) || rangeB.end.isSame(rangeA.end)) {
          if (rangeB.start.isBefore(rangeA.start)) {
            newRanges.push(new CalendarTools.Range({
              start: rangeB.start.clone(),
              end: rangeA.end.clone()
            }));
          } else {
            newRanges.push(rangeA);
          }
          rangeBPushed = true;
          continue;
        }
        newRanges.push(new CalendarTools.Range({
          start: rangeA.start.clone(),
          end: rangeB.end.clone()
        }));
        rangeBPushed = true;
      }
    }
    if (!rangeBPushed) {
      newRanges.push(rangeB);
    }
    newRanges.sort(function(a, b) {
      return a.start.isAfter(b.start);
    });
    this.set('fetchedRanges', newRanges);
  },
  debugFetchranges: (function() {
    var fRange, i, len, ref, res;
    res = [];
    ref = this.get('fetchedRanges');
    for (i = 0, len = ref.length; i < len; i++) {
      fRange = ref[i];
      res.push(fRange.start.toString() + ' -> ' + fRange.end.toString());
    }
    return res.join('\n');
  }).property('fetchedRanges.@each')
});

export default component;
