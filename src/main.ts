import * as core from '@actions/core'
import { hasExtension, isNotNodeModule } from './filters'
import * as git from './git'
import {
  normalizedExtension,
  parseExtensions,
  remoteBranch,
  trimPrefix,
} from './util'
import { RemoteBranch } from './types'
import * as kit from '@harveyr/github-actions-kit'

// async function getParentForDetachedHead(baseBranch: string): Promise<string> {
//   return git.findParentCommitSha(`origin/${baseBranch}`, 'HEAD')
// }

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

  // const out = await kit.execAndCapture(
  //   'git',
  //   [
  //     'diff',
  //     '--name-only',
  //     '--diff-filter=ACMRT',
  //     remoteBranch({ remote, branch: baseBranch }),
  //   ],
  //   { failOnStdErr: false },
  // )

  // let parentSha = ''
  // if (currentBranch === 'HEAD') {
  //   parentSha = await getParentForDetachedHead(baseBranch)
  //   const stuff = await kit.execAndCapture(
  //     'git',
  //     [
  //       'diff',
  //       '--name-only',
  //       '--diff-filter=ACMRT',
  //       remoteBranch({ remote, branch: baseBranch }),
  //     ],
  //     { failOnStdErr: false },
  //   )
  //   console.log('FIXME: stuff1!', stuff)
  // } else {
  //   await git.fetch(baseBranch)
  //   const stuff = await kit.execAndCapture(
  //     'git',
  //     ['diff', '--name-only', '--diff-filter=ACMRT', remoteBranch(baseBranch)],
  //     { failOnStdErr: false },
  //   )
  //   console.log('FIXME: stuff2!', stuff)
  //   parentSha = await git.findParentCommitSha(
  //     currentBranch,
  //     `origin/${baseBranch}`,
  //   )
  // }

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
