import * as core from '@actions/core'
import { diffFiles, findParentCommitSha } from './git'
import { parseExtensions, trimPrefix } from './util'
import { filesWithExtensions, isNotNodeModule } from './filters'

async function run(): Promise<void> {
  const baseBranch = core.getInput('base-branch')
  const extensions = parseExtensions(core.getInput('extensions'))

  const parentSha = await findParentCommitSha(baseBranch)
  const allFiles = await diffFiles(parentSha)

  let filtered = allFiles.filter(isNotNodeModule)
  filtered = filesWithExtensions(allFiles, extensions).map(f => {
    return trimPrefix(f, core.getInput('trim-prefix'))
  })

  core.setOutput('files', filtered.join(' '))
}

run().catch(err => {
  core.setFailed(`${err}`)
})
