import { DBQuery } from './dbQuery'

test('DBQuery', () => {
  const q = new DBQuery('TestKind')
  expect(q.table).toBe('TestKind')
  expect(q.prettyConditions()).toEqual([])
})

test('prettyConditions', () => {
  const q = new DBQuery('TestKind').filter('a', '>', 5)
  expect(q.prettyConditions()).toEqual(['a>5'])
  expect(q.pretty()).toEqual('a>5')
})

test('toJson, fromJson', () => {
  const q = new DBQuery('TestKind').filter('a', '>', 5).order('a', true).select(['a', 'b']).limit(3)

  // const json = JSON.stringify(q, null, 2)
  // console.log(json)

  const q2 = DBQuery.fromPlainObject(JSON.parse(JSON.stringify(q)))
  // console.log(q2)

  expect(q2).toEqual(q)
  expect(q2).toBeInstanceOf(DBQuery)
})
