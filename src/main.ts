import * as core from '@actions/core'
import { hasExtension, isNotNodeModule } from './filters'
import * as git from './git'
import { normalizedExtension, parseExtensions, trimPrefix } from './util'
import * as kit from '@harveyr/github-actions-kit'

async function getParentForDetachedHead(baseBranch: string): Promise<string> {
  return git.findParentCommitSha(`origin/${baseBranch}`, 'HEAD')
}

async function run(): Promise<void> {
  const baseBranch = core.getInput('base_branch')
  const extensions = parseExtensions(core.getInput('extensions')).map(
    normalizedExtension,
  )

  const currentBranch = await git.getCurrentBranch()
  let parentSha = ''
  if (currentBranch === 'HEAD') {
    parentSha = await getParentForDetachedHead(baseBranch)
  } else {
    await git.fetch(baseBranch)
    await kit.execAndCapture('git', [
      'diff',
      '--name-only',
      '--diff-filter=ACMRT',
      baseBranch,
    ])
    parentSha = await git.findParentCommitSha(
      currentBranch,
      `origin/${baseBranch}`,
    )
  }

  const allFiles = await git.diffFiles(parentSha)

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
