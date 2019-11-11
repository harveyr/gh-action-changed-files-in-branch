import * as path from 'path'

export function isNotNodeModule(path: string): boolean {
  return Boolean(
    path &&
      path.indexOf('node_modules/') !== 0 &&
      path.indexOf('/node_modules/') === -1,
  )
}

export function hasExtension(fp: string, extensions: string[]): boolean {
  if (!extensions.length) {
    return true
  }
  if (!fp) {
    return false
  }
  return extensions.includes(path.extname(fp))
}
