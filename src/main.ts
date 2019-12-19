import * as core from '@actions/core'
import * as kit from '@harveyr/github-actions-kit'
import { hasExtension, isNotNodeModule } from './filters'
import { DiffParam, RemoteBranch } from './types'
import {
  normalizedExtension,
  parseExtensions,
  remoteBranchString,
  trimPrefix,
} from './util'

async function getMergeBase(param: DiffParam): Promise<string> {
  const { currentRef, baseRef } = param
  const cmd = await kit.execAndCapture(
    'git',
    ['merge-base', currentRef, baseRef],
    { failOnStdErr: true },
  )
  return cmd.stdout
}

async function diffFiles(param: DiffParam): Promise<string[]> {
  const { currentRef, baseRef } = param
  const cmd = await kit.execAndCapture(
    'git',
    ['diff', '--name-only', '--diff-filter=ACMRT', currentRef, baseRef],
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

/**
 * If we're in a shallow checkout, pull the rest of the history so we can
 * compare against the base branch.
 *
 * This _seems_ to be necessary, but I arrived here through trial and error. So
 * if there's a better way, please educate me.
 */
async function pullUnshallow(): Promise<void> {
  const isShallow = await kit.execAndCapture(
    'git',
    ['rev-parse', '--is-shallow-repository'],
    { failOnStdErr: true },
  )
  if (isShallow.stdout === 'true') {
    await kit.execAndCapture('git', ['pull', '--unshallow'])
  }
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
  if (currentRef === 'HEAD') {
    throw new Error(
      'Detached HEAD detected. Are you using actions/checkout v2+?',
    )
  }
  await pullUnshallow()
  await fetch(remoteBranch)

  const mergeBase = await getMergeBase({
    currentRef,
    baseRef: remoteBranchString(remoteBranch),
  })
  const allFiles = await diffFiles({ currentRef, baseRef: mergeBase })

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
