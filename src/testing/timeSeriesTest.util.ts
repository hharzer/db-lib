import { _randomInt, _range } from '@naturalcycles/js-lib'
import { TimeSeriesDataPoint } from '../time/timeSeries.model'

export function createTestTimeSeries(count = 10): TimeSeriesDataPoint[] {
  const ts = Date.now()
  return _range(1, count + 1).map(i => [ts - i * 60_000, _randomInt(10, 20)])
}
