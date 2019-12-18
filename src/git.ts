import * as kit from '@harveyr/github-actions-kit'

export async function fetch(): Promise<void> {
  await kit.execAndCapture('git', ['fetch'], { failOnStdErr: false })
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
  currentBranch: string,
  baseBranch: string,
): Promise<string> {
  const { stdout } = await kit.execAndCapture(
    'git',
    ['merge-base', currentBranch, baseBranch],
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
