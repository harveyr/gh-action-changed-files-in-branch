import { fileMatchesGlob } from '../src/globs'

test.each([
  ['a.py', '**.py', true],
  ['a.py', '**.js', false],
  ['src/file.ts', '**.ts', false],
  ['src/file.ts', '**/**.ts', true],
  ['src/file.ts', 'src/**/**.ts', true],
  ['src/some/deep/file.ts', '**/**.ts', true],
  ['src/file.ts', 'src/**.ts', true],
  ['src/file.ts', 'elsewhere/**.ts', false],
  ['package.json', '*.json', true],
  ['package.json', 'package.json', true],
  ['package.json', 'package.*', true],
])('glob: %s -> %s == %s', (...args: (string | boolean)[]) => {
  const filename = args[0].toString()
  const glob = args[1].toString()
  const expected = Boolean(args[2])
  expect(fileMatchesGlob({ filename, glob })).toEqual(expected)
})
