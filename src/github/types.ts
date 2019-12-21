export interface GetCommitsResponse {
  repository: {
    ref: {
      target: {
        history: {
          pageInfo: {
            hasNextPage: boolean
            endCursor: string
          }
          edges: {
            node: { oid: string }
          }[]
        }
      }
    }
  }
}

export interface ChangedFile {
  filename: string
  status: string
}
