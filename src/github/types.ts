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
