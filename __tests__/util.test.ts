import { parseExtensions, trimPrefix } from '../src/util'

test('parse extensions', async () => {
  expect(parseExtensions(undefined)).toEqual([])
  expect(parseExtensions('')).toEqual([])
  expect(parseExtensions('js')).toEqual(['.js'])
  expect(parseExtensions('js  ts')).toEqual(['.js', '.ts'])
  expect(parseExtensions('js  ts   .py')).toEqual(['.js', '.ts', '.py'])
})

test('trim prefix', async () => {
  expect(trimPrefix('')).toEqual('')
  expect(trimPrefix('', '')).toEqual('')
  expect(trimPrefix('', 'asdf')).toEqual('')
  expect(trimPrefix('ui/path/to/file.js', '')).toEqual('ui/path/to/file.js')
  expect(trimPrefix('ui/path/to/file.js', 'ui/')).toEqual('path/to/file.js')
  expect(trimPrefix('ui/path/to/file.js', 'i/')).toEqual('ui/path/to/file.js')
})
