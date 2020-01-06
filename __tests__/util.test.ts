import { trimPrefix } from '../src/util'

test('trim prefix', async () => {
  expect(trimPrefix('')).toEqual('')
  expect(trimPrefix('', '')).toEqual('')
  expect(trimPrefix('', 'asdf')).toEqual('')
  expect(trimPrefix('ui/path/to/file.js', '')).toEqual('ui/path/to/file.js')
  expect(trimPrefix('ui/path/to/file.js', 'ui/')).toEqual('path/to/file.js')
  expect(trimPrefix('ui/path/to/file.js', 'i/')).toEqual('ui/path/to/file.js')
})
