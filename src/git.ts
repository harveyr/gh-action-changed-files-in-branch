import * as kit from '@harveyr/github-actions-kit'

export async function fetch(branch: string): Promise<void> {
  await kit.execAndCapture('git', ['fetch', 'origin', branch], {
    failOnStdErr: false,
  })
}

export async function getCurrentBranch(): Promise<string> {
  const { stdout } = await kit.execAndCapture(
    'git',
    ['rev-parse', '--abbrev-ref', 'HEAD'],
    { failOnStdErr: true },
  )
  return stdout
}

export async function findParentCommitSha(
  commit1: string,
  commit2: string,
): Promise<string> {
  const { stdout } = await kit.execAndCapture(
    'git',
    ['merge-base', commit1, commit2],
    { failOnStdErr: true },
  )
  return stdout
}

export async function diffFiles(parentSha: string): Promise<string[]> {
  const { stdout } = await kit.execAndCapture(
    'git',
    ['diff', '--name-only', '--diff-filter=ACMRT', parentSha, 'HEAD'],
    { failOnStdErr: true },
  )
  const result = stdout.trim().split('\n')
  result.sort()
  return result
}
