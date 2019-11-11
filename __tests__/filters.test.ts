import { filesWithExtensions, isNotNodeModule } from '../src/filters'

test('is not node module', async () => {
  expect(isNotNodeModule('asdf.ts')).toBe(true)
  expect(isNotNodeModule('asdf_modules/asdf.ts')).toBe(true)
  expect(isNotNodeModule('node_modules/asdf.ts')).toBe(false)
  expect(isNotNodeModule('asdf/node_modules/asdf.ts')).toBe(false)
})

test('filtered files: empty cases', async () => {
  expect(filesWithExtensions([], [])).toEqual([])
  expect(filesWithExtensions([], ['.js'])).toEqual([])
})

test('filtered files: no extensions provided returns full list', async () => {
  expect(filesWithExtensions(['apple.py', 'banana.js'], [])).toEqual([
    'apple.py',
    'banana.js',
  ])
})

test('filtered files: single extension filter', async () => {
  expect(filesWithExtensions(['apple.py', 'banana.js'], ['.py'])).toEqual([
    'apple.py',
  ])
  // test extension without the dot
  expect(filesWithExtensions(['apple.py', 'banana.js'], ['py'])).toEqual([
    'apple.py',
  ])
  // test multiple files returned
  expect(
    filesWithExtensions(['apple.py', 'banana.js', 'key_lime.py'], ['.py']),
  ).toEqual(['apple.py', 'key_lime.py'])
})

test('filtered files: multiple extensions filter', async () => {
  expect(
    filesWithExtensions(
      ['apple.py', 'banana.js', 'key_lime.py', 'teeth.ts'],
      ['.py', 'ts'],
    ),
  ).toEqual(['apple.py', 'key_lime.py', 'teeth.ts'])
})
