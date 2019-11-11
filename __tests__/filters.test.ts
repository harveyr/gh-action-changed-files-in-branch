import { hasExtension, isNotNodeModule } from '../src/filters'

test('is not node module', async () => {
  expect(isNotNodeModule('asdf.ts')).toBe(true)
  expect(isNotNodeModule('asdf_modules/asdf.ts')).toBe(true)
  expect(isNotNodeModule('node_modules/asdf.ts')).toBe(false)
  expect(isNotNodeModule('asdf/node_modules/asdf.ts')).toBe(false)
})

test('filtered files: empty cases', async () => {
  expect(hasExtension('', [])).toEqual(true)
})

test('filtered files: no extensions provided returns true', async () => {
  expect(hasExtension('apple.py', [])).toBe(true)
})

test('filtered files: single extension filter', async () => {
  expect(hasExtension('apple.py', ['.py'])).toBe(true)
  expect(hasExtension('apple.py', ['.js'])).toBe(false)
  expect(hasExtension('apple.js', ['.py'])).toBe(false)
})

test('filtered files: multiple extensions filter', async () => {
  expect(hasExtension('apple.py', ['.py', '.ts'])).toBe(true)
})
