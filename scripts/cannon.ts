/*

yarn tsn cannon

 */

// tslint:disable:no-unused-variable
import { expressFunctionFactory, runCannon } from '@naturalcycles/bench-lib'
import { _omit } from '@naturalcycles/js-lib'
import { getValidationResult, stringId } from '@naturalcycles/nodejs-lib'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { CommonDao, InMemoryDB } from '../src'
import { createTestItemsBM, testItemBMSchema, testItemDBMSchema, TEST_TABLE } from '../src/testing'

runScript(async () => {
  await runCannon(
    {
      // register1: expressFunctionFactory(register1),
      // register2: expressFunctionFactory(register2),
      register3: expressFunctionFactory(register3),
      // register4: expressFunctionFactory(register4),
      registerFull: expressFunctionFactory(registerFull),
      validate1: expressFunctionFactory(validate1),
    },
    {
      runs: 1,
      duration: 5,
      cooldown: 1,
      renderLatencyTable: false,
      name: 'cannon2',
    },
  )
})

const db = new InMemoryDB()
const dao = new CommonDao({
  table: TEST_TABLE,
  db,
  dbmSchema: testItemDBMSchema,
  bmSchema: testItemBMSchema,
})

async function register1() {
  const [item] = createTestItemsBM(1).map(r => _omit(r, ['id']))
  item.id = stringId()
  return { item }
}

async function register2() {
  const [item] = createTestItemsBM(1).map(r => _omit(r, ['id']))
  item.id = stringId()
  await db.saveBatch(TEST_TABLE, [item])
  return { item }
}

async function register3() {
  let [item] = createTestItemsBM(1).map(r => _omit(r, ['id']))
  item = await dao.save(item, { skipConversion: true })
  return { item }
}

async function register4() {
  let [item] = createTestItemsBM(1).map(r => _omit(r, ['id']))
  item = await dao.save(item, { skipValidation: true })
  return { item }
}

async function registerFull() {
  let [item] = createTestItemsBM(1).map(r => _omit(r, ['id']))
  item = await dao.save(item)
  return { item }
}

async function validate1() {
  const [item] = createTestItemsBM(1).map(r => _omit(r, ['id']))
  item.id = stringId()
  getValidationResult(item, testItemBMSchema)

  return { item }
}
