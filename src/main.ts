import * as core from '@actions/core'
import * as kit from '@harveyr/github-actions-kit'
import { hasExtension, isNotNodeModule } from './filters'
import { RemoteBranch } from './types'
import {
  normalizedExtension,
  parseExtensions,
  remoteBranch,
  trimPrefix,
} from './util'

async function diffFiles(branch: RemoteBranch): Promise<string[]> {
  const cmd = await kit.execAndCapture(
    'git',
    ['diff', '--name-only', '--diff-filter=ACMRT', remoteBranch(branch)],
    { failOnStdErr: false },
  )
  const out = cmd.stdout + cmd.stderr
  return out.split('\n').map(token => {
    return token.trim()
  })
}

async function getCurrentRef(): Promise<string> {
  const { stdout } = await kit.execAndCapture(
    'git',
    ['rev-parse', '--abbrev-ref', 'HEAD'],
    { failOnStdErr: true },
  )
  return stdout
}

async function fetch(param: RemoteBranch): Promise<void> {
  const { remote, branch } = param
  await kit.execAndCapture('git', ['fetch', remote, branch])
}

async function run(): Promise<void> {
  const remote = 'origin'
  const baseBranch = core.getInput('base_branch')
  const extensions = parseExtensions(core.getInput('extensions')).map(
    normalizedExtension,
  )
  const remoteBranch: RemoteBranch = {
    remote,
    branch: baseBranch,
  }

  const currentRef = await getCurrentRef()
  if (currentRef !== 'HEAD') {
    // My git wisdom is not deep enough to know why we need to fetch the branch
    // only if we're not in a detached HEAD state.
    await fetch(remoteBranch)
  }

  const allFiles = await diffFiles(remoteBranch)

  const filtered = allFiles
    .filter(isNotNodeModule)
    .filter(fp => {
      return hasExtension(fp, extensions)
    })
    .map(fp => {
      return trimPrefix(fp, core.getInput('trim_prefix'))
    })

  core.setOutput('files', filtered.join(' '))
}

run().catch(err => {
  core.setFailed(`${err}`)
})
