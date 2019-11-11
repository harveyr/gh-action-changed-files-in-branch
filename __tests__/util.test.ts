import { filteredFiles, parseExtensions } from '../src/util'

test('filtered files: empty cases', async () => {
  expect(filteredFiles([], [])).toEqual([])
  expect(filteredFiles([], ['.js'])).toEqual([])
})

test('filtered files: no extensions provided returns full list', async () => {
  expect(filteredFiles(['apple.py', 'banana.js'], [])).toEqual([
    'apple.py',
    'banana.js',
  ])
})

test('filtered files: single extension filter', async () => {
  expect(filteredFiles(['apple.py', 'banana.js'], ['.py'])).toEqual([
    'apple.py',
  ])
  // test extension without the dot
  expect(filteredFiles(['apple.py', 'banana.js'], ['py'])).toEqual(['apple.py'])
  // test multiple files returned
  expect(
    filteredFiles(['apple.py', 'banana.js', 'key_lime.py'], ['.py']),
  ).toEqual(['apple.py', 'key_lime.py'])
})

test('filtered files: multiple extensions filter', async () => {
  expect(
    filteredFiles(
      ['apple.py', 'banana.js', 'key_lime.py', 'teeth.ts'],
      ['.py', 'ts'],
    ),
  ).toEqual(['apple.py', 'key_lime.py', 'teeth.ts'])
})

test('parse extensions', async () => {
  expect(parseExtensions(undefined)).toEqual([])
  expect(parseExtensions('')).toEqual([])
  expect(parseExtensions('js')).toEqual(['.js'])
  expect(parseExtensions('js  ts')).toEqual(['.js', '.ts'])
  expect(parseExtensions('js  ts   .py')).toEqual(['.js', '.ts', '.py'])
})
