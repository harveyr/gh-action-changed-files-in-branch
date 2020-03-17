import { RemoteBranch } from './types'

export function remoteBranchString(param: RemoteBranch): string {
  const { remote, branch } = param
  const prefix = `${remote}/`
  if (branch.indexOf(prefix) === 0) {
    return branch
  }

  return prefix + branch
}

export function trimPrefix(path: string, prefix?: string): string {
  if (path && prefix && path.indexOf(prefix) === 0)
    return path.slice(prefix.length)
  return path
}
