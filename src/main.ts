import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run() {
  const baseBranch = core.getInput('base-branch')
  let stdout = ''
  let stderr = ''

  await exec.exec(
    'git',
    ['diff', '--name-only', '--diff-filter=ACMRT', `origin/${baseBranch}`],
    {
      listeners: {
        stdout: (data: Buffer) => {
          stdout += data.toString()
        },
        stderr: (data: Buffer) => {
          stderr += data.toString()
        }
      }
    }
  )

  if (stderr.trim()) {
    return core.setFailed('stderr was not empty')
  }

  const allFiles = stdout.trim().split('\n')
  allFiles.sort()
}

run().catch(err => {
  core.setFailed(`${err}`)
})
