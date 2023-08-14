import Bluebird from 'bluebird'
import fs from 'graceful-fs'

export const readFile = Bluebird.promisify(fs.readFile)
export const writeFile = Bluebird.promisify(fs.writeFile)
export const rm = Bluebird.promisify(fs.rm)
