import * as path from 'path'

export function normalizedExtension(ext: string): string {
  if (!ext) {
    return ext
  }
  if (ext.indexOf('.') === 0) {
    return ext
  }
  return `.${ext}`
}

export function filteredFiles(files: string[], extensions: string[]): string[] {
  if (!extensions.length) {
    return files
  }

  extensions = extensions.map(normalizedExtension)

  return files.filter(f => {
    return extensions.includes(path.extname(f))
  })
}

export function parseExtensions(input?: string): string[] {
  if (!input) return []

  return input
    .trim()
    .split(' ')
    .map(e => {
      return e.trim()
    })
    .filter(e => {
      return e.length > 0
    })
    .map(normalizedExtension)
}

export function trimPrefix(path: string, prefix?: string): string {
  if (path && prefix && path.indexOf(prefix) === 0)
    return path.slice(prefix.length)
  return path
}
