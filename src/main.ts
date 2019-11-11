import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run() {
  const baseBranch = core.getInput('base-branch')
  let stdout = ''
  let stderr = ''

  console.log('Diffing against branch %s', baseBranch)

  exec.exec('git', ['diff', '--name-only', '--diff-filter=ACMRT', baseBranch], {
    listeners: {
      stdout: (data: Buffer) => {
        stdout += data.toString()
      },
      stderr: (data: Buffer) => {
        stderr += data.toString()
      }
    }
  })

  console.log('stdout', stdout)
  console.log('stderr', stderr)
}

run().catch(err => {
  core.setFailed(`${err}`)
})
