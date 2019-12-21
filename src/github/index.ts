import * as github from '@actions/github'
import { GetCommitsResponse, ChangedFile } from './types'

interface ApiParam {
  githubToken: string
}

interface GetCommitsParam extends ApiParam {
  branch: string
}

interface Repo {
  owner: string
  repo: string
  branch: string
}

export function getContext(): Repo {
  return {
    ...github.context.repo,
    branch: github.context.ref.replace('refs/heads/', ''),
  }
}

export interface CompareCommitParam extends ApiParam {
  baseBranch: string
}

export async function compareCommitFiles(
  param: CompareCommitParam,
): Promise<ChangedFile[]> {
  const { githubToken, baseBranch } = param
  const { owner, repo, branch } = getContext()
  const octokit = new github.GitHub(githubToken)

  const result = await octokit.repos.compareCommits({
    repo,
    owner,
    base: baseBranch,
    head: branch,
  })

  return result.data.files.map(f => {
    // I'm sure there's a cleaner way to do this. Forgive me.
    const { status, filename } = f
    return { status, filename }
  })
}

export async function getCommits(param: ApiParam): Promise<string[]> {
  const { githubToken } = param
  const { owner, repo, branch } = getContext()

  const octokit = new github.GitHub(githubToken)
  const result = (await octokit.graphql(
    `
    query($owner: String!, $repo: String!, $branch: String!) {
      repository(owner: $owner, name: $repo) {
        ref(qualifiedName: $branch) {
          target {
            ... on Commit {
              history(first: 50) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                edges {
                  node {
                    oid
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      owner,
      repo,
      branch,
      headers: { authorization: `token ${githubToken}` },
    },
  )) as GetCommitsResponse

  const commitIds = result.repository.ref.target.history.edges.map(edge => {
    return edge.node.oid
  })
  const {
    hasNextPage,
    endCursor,
  } = result.repository.ref.target.history.pageInfo

  console.log(
    'Fetched %s ids. pageInfo: %s',
    commitIds.length,
    JSON.stringify({ hasNextPage, endCursor }),
  )

  return commitIds
}
