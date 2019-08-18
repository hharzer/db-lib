import {
  TEST_TABLE,
  testDao,
  testDB,
  TestItem,
  testItemUnsavedSchema,
} from '@naturalcycles/db-dev-lib'
import { CommonDao, CommonDaoLogLevel } from './common.dao'
import { DBQuery } from './dbQuery'
import { InMemoryDB } from './inMemory.db'

const db = new InMemoryDB()

const dao = new CommonDao<TestItem>({
  table: TEST_TABLE,
  db,
  dbmUnsavedSchema: testItemUnsavedSchema,
  bmUnsavedSchema: testItemUnsavedSchema,
  logStarted: true,
  logLevel: CommonDaoLogLevel.DATA_FULL,
})

test('testDB', async () => {
  await testDB(db as any, DBQuery)
})

test('testDao', async () => {
  await testDao(dao as any, DBQuery)
})
