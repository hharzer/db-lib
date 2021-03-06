import { pMap } from '@naturalcycles/js-lib'
import {
  transformJsonParse,
  transformSplit,
  transformToNDJson,
  writablePushToArray,
  _pipeline,
} from '@naturalcycles/nodejs-lib'
import * as fs from 'fs-extra'
import { Readable } from 'stream'
import { createGzip, createUnzip } from 'zlib'
import { DBSaveBatchOperation, ObjectWithId } from '../../db.model'
import { FileDBPersistencePlugin } from './file.db.model'

export interface LocalFilePersistencePluginCfg {
  /**
   * @default ./tmp/localdb
   */
  storagePath: string

  /**
   * @default true
   */
  gzip: boolean
}

/**
 * Persists in local filesystem as ndjson.
 */
export class LocalFilePersistencePlugin implements FileDBPersistencePlugin {
  constructor(cfg: Partial<LocalFilePersistencePluginCfg> = {}) {
    this.cfg = {
      storagePath: './tmp/localdb',
      gzip: true,
      ...cfg,
    }
  }

  public cfg!: LocalFilePersistencePluginCfg

  async ping(): Promise<void> {}

  async getTables(): Promise<string[]> {
    return (await fs.readdir(this.cfg.storagePath))
      .filter(f => f.includes('.ndjson'))
      .map(f => f.split('.ndjson')[0])
  }

  async loadFile<ROW extends ObjectWithId>(table: string): Promise<ROW[]> {
    await fs.ensureDir(this.cfg.storagePath)
    const ext = `ndjson${this.cfg.gzip ? '.gz' : ''}`
    const filePath = `${this.cfg.storagePath}/${table}.${ext}`

    if (!(await fs.pathExists(filePath))) return []

    const transformUnzip = this.cfg.gzip ? [createUnzip()] : []

    const rows: ROW[] = []

    await _pipeline([
      fs.createReadStream(filePath),
      ...transformUnzip,
      transformSplit(), // splits by \n
      transformJsonParse(),
      writablePushToArray(rows),
    ])

    return rows
  }

  async saveFiles(ops: DBSaveBatchOperation[]): Promise<void> {
    await pMap(ops, async op => await this.saveFile(op.table, op.rows), { concurrency: 16 })
  }

  async saveFile<ROW extends ObjectWithId>(table: string, rows: ROW[]): Promise<void> {
    await fs.ensureDir(this.cfg.storagePath)
    const ext = `ndjson${this.cfg.gzip ? '.gz' : ''}`
    const filePath = `${this.cfg.storagePath}/${table}.${ext}`
    const transformZip = this.cfg.gzip ? [createGzip()] : []

    await _pipeline([
      Readable.from(rows),
      transformToNDJson(),
      ...transformZip,
      fs.createWriteStream(filePath),
    ])
  }
}
