import minimatch from 'minimatch'

export interface GlobMatchParam {
  filename: string
  glob: string
}

export function fileMatchesGlob(param: GlobMatchParam): boolean {
  const { filename, glob } = param

  return minimatch(filename, glob)
}

export interface GlobsMatchParam {
  filename: string
  globs: string[]
}

export function fileMatchesGlobs(param: GlobsMatchParam): boolean {
  const { filename, globs } = param
  return Boolean(
    globs.find(glob => {
      return fileMatchesGlob({ filename, glob })
    }),
  )
}
