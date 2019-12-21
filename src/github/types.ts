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

export type ChangedFileStatus = 'added' | 'modified'

export interface ChangedFile {
  filename: string
  status: ChangedFileStatus
}
