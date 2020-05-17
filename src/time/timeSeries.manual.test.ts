import { InMemoryDB } from '..'
import { createTestTimeSeries } from '../testing/timeSeriesTest.util'
import { CommonTimeSeriesDao } from './commonTimeSeriesDao'

const db = new InMemoryDB({
  persistenceEnabled: true,
  persistZip: false,
})

const tsDao = new CommonTimeSeriesDao({
  db,
})

test('test1', async () => {
  const points = createTestTimeSeries()
  await tsDao.saveBatch('lala', points)

  const r = await tsDao.query({ series: 'lala' })
  console.log(r)

  // await db.flushToDisk()
})
