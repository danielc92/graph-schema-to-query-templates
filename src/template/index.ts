import { GraphQLObjectType, GraphQLSchema } from "graphql"
import { getFieldsFromRoot } from "../helpers"
import { Entry, SupportedQueryTypes } from "../types"

type TemplateBuilderConfig = {
    graphSchema: GraphQLSchema
    entry: Entry
    serviceName: string
    uniqueExports?: boolean
}
class TemplateBuilder {
  
  config: TemplateBuilderConfig
  fieldTracker: Map<string, number>

  constructor(config:TemplateBuilderConfig) {
    this.config = config
    this.fieldTracker = new Map<string, number>()
  }

  // get the core type of a graphql type eg '[String!]!' => 'String'
  private _cleanType = (type:string ) => type.replace(/[\W_]+/g,"")

  private _getFieldNamesRecurs = (rawType: string, graphSchema: GraphQLSchema, parentFieldKey?: string): string => {
    const parsedType =  this._cleanType(rawType)

    if (graphSchema.getTypeMap()[parsedType] instanceof GraphQLObjectType) {
      const fields = getFieldsFromRoot(graphSchema, parsedType)
      for (const field of fields) {
       
        const fieldKey = `${field.name}__${field.type}`
        if (this.fieldTracker.has(fieldKey)) {
          // increment  visit
          this.fieldTracker.set(fieldKey, this.fieldTracker.get(fieldKey)! + 1)
        } else {
          // the first visit
          this.fieldTracker.set(fieldKey, 1)
        }
       
      }
      return `{${fields
        .filter(
          field => {
            const fieldKey = `${field.name}__${field.type}`
            const currentVisit = this.fieldTracker.get(fieldKey)
            const isRecursiveField = fieldKey === parentFieldKey
            if (typeof currentVisit === "number" && currentVisit >= 2 && isRecursiveField) {
              return false
            }

            return true
          }
        )
        .map(f => `${f.name} ${this._getFieldNamesRecurs(f.type.toString(), graphSchema, `${f.name}__${f.type}`)}`).join(" ")}}`
    } 
    return ""
  }
    
  // Builds a template string based on ancestor path
  private _buildAncestorTemplate = (ancestors: string[], s: string, content: string): string => {
    // base case
    if (ancestors.length === 0) return content
    // recursive case
    const newAncestors = ancestors.slice(1)
    return `${ancestors[0]} { ${this._buildAncestorTemplate(newAncestors, s, content)} }`
  }
    
  // Builds one template eg "const template = `query foo {}` "
  intoJsTemplate = (kind: SupportedQueryTypes):string => {
    const {serviceName, graphSchema, entry} = this.config;
    const {type, name, args, ancestors} = entry
    const allFields = this._getFieldNamesRecurs(type, graphSchema)
    const topLevelGraphTemplate = `${name}${args.length ? `(${args.map(arg => `${arg.name}: $${arg.name}`).join(", ")})` : ""} ${allFields}`
    const innerGraphTemplate = ancestors.length ? this._buildAncestorTemplate(ancestors,"",topLevelGraphTemplate) : topLevelGraphTemplate
    const templateName = `${serviceName}__${ancestors.join("__")}__${name}`
    const graphqlTemplate =  `${kind.toLocaleLowerCase()} ${templateName}${args.length ? `(${args.map(arg => `$${arg.name}: ${arg.type}`).join(", ")})` : ""} {${innerGraphTemplate}}`
    
    const variableNameToExport = this.config.uniqueExports === true ? templateName : "template"
    
    const javascriptTemplate  = `export const ${variableNameToExport} = \`${graphqlTemplate}\`;`
    return javascriptTemplate
  }
}

export {TemplateBuilder}