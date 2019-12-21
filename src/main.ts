import * as core from '@actions/core'
import * as kit from '@harveyr/github-actions-kit'
import * as github from './github'
import { hasExtension, isNotNodeModule } from './filters'
import { DiffParam, RemoteBranch } from './types'
import {
  normalizedExtension,
  parseExtensions,
  remoteBranchString,
  trimPrefix,
} from './util'

import { CompareCommitParam } from './github'

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
    ['diff', '--name-only', '--diff-filter=ACMRT', baseRef, currentRef],
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
  // This pull will fail if we run it against a non-shallow checkout, so we
  // check first.
  if (isShallow.stdout === 'true') {
    await kit.execAndCapture('git', ['pull', '--unshallow'])
  }
}

async function fetch(param: RemoteBranch): Promise<void> {
  const { remote, branch } = param
  await kit.execAndCapture('git', ['fetch', remote, branch])
}

interface ShellDiffParam {
  remoteBranch: RemoteBranch
}

async function diffFilesViaShell(param: ShellDiffParam): Promise<string[]> {
  const { remoteBranch } = param
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
  return diffFiles({ currentRef, baseRef: mergeBase })
}

async function diffFilesViaApi(param: CompareCommitParam): Promise<string[]> {
  const files = await github.compareCommitFiles(param)
  return files
    .filter(f => {
      return f.status !== 'deleted'
    })
    .map(f => {
      return f.filename
    })
}

async function run(): Promise<void> {
  const remote = kit.getInputSafe('remote')
  const useApi = kit.getInputSafe('use-api') === 'true'
  const githubToken = kit.getInputSafe('github-token')
  const baseBranch = kit.getInputSafe('base-branch')
  const extensions = parseExtensions(kit.getInputSafe('extensions')).map(
    normalizedExtension,
  )

  let files: string[] = []

  if (useApi) {
    if (!githubToken) {
      throw new Error('use-api is enabled but github token not provided')
    }
    files = await diffFilesViaApi({ githubToken, baseBranch })
    // const commitIds = await github.getCommits({ githubToken })
    // console.log('commitIds', commitIds)
  } else {
    const remoteBranch: RemoteBranch = {
      remote,
      branch: baseBranch,
    }
    files = await diffFilesViaShell({ remoteBranch })
  }

  const filtered = files
    .filter(isNotNodeModule)
    .filter(fp => {
      return hasExtension(fp, extensions)
    })
    .map(fp => {
      return trimPrefix(fp, kit.getInputSafe('trim-prefix'))
    })

  core.setOutput('files', filtered.join(' '))
}

run().catch(err => {
  core.setFailed(`${err}`)
})
