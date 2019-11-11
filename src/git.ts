import { captureOutput } from './exec'

export async function findParentCommitSha(baseBranch: string): Promise<string> {
  const { stdout, stderr } = await captureOutput('git', [
    'merge-base',
    `origin/${baseBranch}`,
    `HEAD`,
  ])
  if (stderr) {
    throw new Error('command failed (stderr not empty)')
  }
  return stdout
}

export async function diffFiles(parentSha: string): Promise<string[]> {
  const { stdout } = await captureOutput(
    'git',
    ['diff', '--name-only', '--diff-filter=ACMRT', parentSha, 'HEAD'],
    { failOnStderr: true },
  )
  const result = stdout.trim().split('\n')
  result.sort()
  return result
}
