import {Source, buildSchema, GraphQLSchema} from 'graphql'
import { FieldTransformer, getFieldsFromRoot } from './helpers';
import { TemplateBuilder } from './template';
import { EntryCollection, ExportCollectionOptions, GqlToTemplateConfig, SupportedQueryTypes } from './types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 
 * todo: add option to export in various formats later
 * For now just export one template per file...
 */

class GqlToTemplate {
  config: Required<GqlToTemplateConfig>
  outputPath: string
  root: GraphQLSchema
  collection: EntryCollection

  constructor(config: GqlToTemplateConfig) {
    if (!/^[a-zA-Z]+$/.test(config.serviceName)) throw new Error("serviceName must only contain lower/upper case letters")
    this.config = {
      ...config, 
      uniqueExports: Boolean(config.uniqueExports), 
      searchTokens: config.searchTokens ?? ["query", "queries", "mutation", "mutations"]
    }
    this.outputPath = config.outputPath
    const typeDef = fs.readFileSync(path.resolve(config.inputPath), 'utf-8');
    const source = new Source(typeDef);
    const graph = buildSchema(source, { 
      assumeValidSDL: false, 
      noLocation: true
    });

    this.collection = {
      "Mutation": [],
      "Query": []
    }

    this.root = graph
  }

  _containsSearchTokens = (type: string, tokens: string[]) => {
    const lower = type.toLocaleLowerCase()
    return tokens.some(t => lower.indexOf(t) > -1)
  }

  exportCollection = (options : ExportCollectionOptions= {}) => {

    const {extension = "js", debug = false} = options;
    const {serviceName, uniqueExports} = this.config;
    const {collection, outputPath} = this;
    const templateBuilderOptions = {graphSchema: this.root, serviceName, uniqueExports}
    
    const queries = collection["Query"].map(entry => ({entry, template: new TemplateBuilder({entry, ...templateBuilderOptions}).intoJsTemplate("Query")}));
    const mutations = collection["Mutation"].map(entry => ({entry, template: new TemplateBuilder({entry, ...templateBuilderOptions}).intoJsTemplate("Mutation")}));
    const data =  [...queries, ...mutations]
    
    // output
    data.forEach(({entry, template}) => {
      const {ancestors, name} = entry;
      const exportedName = `${serviceName}__${ancestors.join("__")}__${name}`
      fs.writeFileSync(path.resolve(outputPath, `${exportedName}.${extension}`), template)
    })

    if (debug) {
      const debugValue = data.map(({template}) => template).join("\n")
      console.log(debugValue)
      return debugValue
    }
  }

  // Todo: make this recursive...
  buildCollection = () => {

    const {searchTokens} = this.config
    const collection: EntryCollection = {
      "Query": [],
      "Mutation": []
    }

    const recursiveCollector = ({type, queryType, ancestors}: {type: string, queryType: SupportedQueryTypes, ancestors: string[]}) => {

      // Note: returns empty array if type is a Scalar, eg String, Int (or custom scalars)
      const graphFields = getFieldsFromRoot(this.root, type)

      for (const graphField of graphFields) {
        const fieldObj = new FieldTransformer(graphField)
        const fieldEntry = fieldObj.intoEntry()
        const currParent = graphField.name;

        if (this._containsSearchTokens(fieldEntry.type, searchTokens)) {
          recursiveCollector({type: fieldEntry.type, queryType, ancestors: [...ancestors, currParent]})
        } else {
          collection[queryType].push({...fieldEntry, ancestors})
        }
      }
    }
  
    // Recurse over Query and Mutation trees...
    recursiveCollector({queryType: "Query", type: "Query", ancestors: []})
    recursiveCollector({queryType: "Mutation", type: "Mutation", ancestors: []})

    this.collection = collection
  
    return this
  }
}

// new GqlToTemplate(testConfig)
//   .buildCollection()

//   .exportCollection({debug: true})

export { GqlToTemplate}