import * as github from '@actions/github'
import { GetCommitsResponse } from './types'

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

  result

  // TODO: cursor
  return result.repository.ref.target.history.edges.map(edge => {
    return edge.node.oid
  })
}

// export async function getCommit(param: ApiParam) {
//   const { githubToken } = param
//   const { owner, repo, branch } = getContext()
// }
