import { GraphQLField, GraphQLScalarType, GraphQLSchema } from "graphql"
import { Entry } from "../types"

export class FieldTransformer {
    
  field: GraphQLField<any, any, any>

  constructor(field: GraphQLField<any, any, any>) {
    this.field = field
  }
    
  // todo
  // isDeprecated = () => this.field.astNode?.directives?.some(d => d.name.value === "deprecated") ?? false

  isScalar = () => this.field.type instanceof GraphQLScalarType

  intoEntry() {
    return {
      name: this.field.name,
      type: this.field.type.toString(),
      fields: [],
      args: this.field.args.map(a =>({
        name: a.name,
        type: a.type.toString()
      })),
      isScalar: this.isScalar(),
      ancestors: [],
    } satisfies Entry
  }
}

export const getFieldsFromRoot = (root: GraphQLSchema, typeName: string): GraphQLField<any,any>[] => {
  const namedType = root.getTypeMap()[typeName]

  if (!namedType) {
    console.info(`[Info] ${typeName} typename does not exist.`)
    return [] 
  }

  // if (namedType instanceof GraphQLScalarType) {
  //   // Skip scalars as they produce no fields
  //   return []
  // }

  // getFields has a type error for reason, even though it always returns data
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Object.values((namedType).getFields()) 
}