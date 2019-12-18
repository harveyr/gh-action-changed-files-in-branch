import * as core from '@actions/core'
import { hasExtension, isNotNodeModule } from './filters'
import * as git from './git'
import { normalizedExtension, parseExtensions, trimPrefix } from './util'

async function run(): Promise<void> {
  const baseBranch = core.getInput('base-branch')
  const extensions = parseExtensions(core.getInput('extensions')).map(
    normalizedExtension,
  )

  const branch = await git.getCurrentBranch()
  if (branch === 'HEAD') {
    core.setFailed(
      'Detached HEAD detected. Are you using v2+ of action/checkout?',
    )
    return
  }

  const parentSha = await git.findParentCommitSha(baseBranch)
  const allFiles = await git.diffFiles(parentSha)

  const filtered = allFiles
    .filter(isNotNodeModule)
    .filter(fp => {
      return hasExtension(fp, extensions)
    })
    .map(fp => {
      return trimPrefix(fp, core.getInput('trim-prefix'))
    })

  core.setOutput('files', filtered.join(' '))
}

run().catch(err => {
  core.setFailed(`${err}`)
})
