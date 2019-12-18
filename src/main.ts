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

async function run(): Promise<void> {
  const remote = 'origin'
  const baseBranch = core.getInput('base_branch')
  const extensions = parseExtensions(core.getInput('extensions')).map(
    normalizedExtension,
  )

  const allFiles = await diffFiles({ remote, branch: baseBranch })

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
