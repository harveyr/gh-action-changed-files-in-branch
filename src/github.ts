import * as github from '@actions/github'

interface ApiParam {
  githubToken: string
}

interface GetCommitsParam extends ApiParam {
  branch: string
}

export async function getCommits(param: ApiParam) {
  const { githubToken } = param
  const { owner, repo } = github.context.repo
  const branch = github.context.ref.replace('refs/heads/', '')

  const octokit = new github.GitHub(githubToken)
  const result = await octokit.graphql(
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
  )

  console.log(
    'result for %s:%s branch %s:',
    owner,
    repo,
    branch,
    JSON.stringify(result, null, 2),
  )
}
