import * as path from 'path'
import { normalizedExtension } from './util'

export function isNotNodeModule(path: string): boolean {
  return Boolean(
    path &&
      path.indexOf('node_modules/') !== 0 &&
      path.indexOf('/node_modules/') === -1,
  )
}

export function filesWithExtensions(
  files: string[],
  extensions: string[],
): string[] {
  if (!extensions.length) {
    return files
  }

  extensions = extensions.map(normalizedExtension)

  return files.filter(f => {
    return extensions.includes(path.extname(f))
  })
}
