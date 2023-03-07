export type EntryArg = {name: string, type:string}

export type Entry = {
    fields: string[]
    name: string
    type: string
    args: EntryArg[]
    isScalar: boolean
    ancestors: string[]
}

export type SupportedQueryTypes = "Mutation" | "Query"

export type GqlToTemplateConfig = {
  inputPath: string,
  searchTokens?: string[],
  outputPath: string,
  serviceName: string
}

export type EntryCollection = Record<SupportedQueryTypes, Entry[]>

export type ExportCollectionOptions = {
  extension?: "ts" | "js",
  debug?: boolean
}
