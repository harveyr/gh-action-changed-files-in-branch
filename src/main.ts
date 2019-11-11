import * as core from '@actions/core'
import { diffFiles, findParentCommitSha } from './git'
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

run().catch(err => {
  core.setFailed(`${err}`)
})
