import { TEST_TABLE, testDao, testDB, testItemUnsavedSchema } from '@naturalcycles/db-dev-lib'
import { CommonDao, CommonDaoLogLevel } from './common.dao'
import { DBQuery } from './dbQuery'
import { SimpleFileDB } from './simpleFile.db'
import { tmpDir } from './test/paths.cnst'

const db = new SimpleFileDB({
  storageDir: `${tmpDir}/storage`,
})

const dao = new CommonDao({
  table: TEST_TABLE,
  db,
  dbmUnsavedSchema: testItemUnsavedSchema,
  bmUnsavedSchema: testItemUnsavedSchema,
  logStarted: true,
  logLevel: CommonDaoLogLevel.DATA_FULL,
})

test.skip('testDB', async () => {
  await testDB(db as any, DBQuery)
})

test.skip('testDao', async () => {
  await testDao(dao as any, DBQuery)
})
