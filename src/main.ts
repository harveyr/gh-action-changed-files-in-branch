import * as core from '@actions/core'
import * as exec from '@actions/exec'

import { captureOutput } from './exec'

import { filteredFiles, parseExtensions, trimPrefix } from './util'

async function run(): Promise<void> {
  const baseBranch = core.getInput('base-branch')
  const extensions = parseExtensions(core.getInput('extensions'))

  const parentSha = await findParentCommitSha(baseBranch)
  const allFiles = await diffFiles(parentSha)
  const filtered = filteredFiles(allFiles, extensions).map(f => {
    return trimPrefix(f, core.getInput('trim-prefix'))
  })
  core.setOutput('files', filtered.join(' '))
}

async function diffFiles(parentSha: string): Promise<string[]> {
  const { stdout } = await captureOutput(
    'git',
    ['diff', '--name-only', '--diff-filter=ACMRT', parentSha, 'HEAD'],
    { failOnStderr: true },
  )
  const result = stdout.trim().split('\n')
  result.sort()
  return result
}

async function findParentCommitSha(baseBranch: string): Promise<string> {
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

run().catch(err => {
  core.setFailed(`${err}`)
})
