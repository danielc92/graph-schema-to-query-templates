# graph-schema-to-query-templates

This repo contains code that enables conversion of graphql schema files (.gql / .graphql) into query template strings.

### Notes
- Supports mjs and cjs imports
- Supports **nested** queries and mutation types, if `searchTokens` is provided
- Currently supports building templates from Mutation and Query types (recusively)

### Usage
For example with a schema file `test.graphql`
```
type Query {
    foo: String
    bar: Int
    animals: AnimalQueries
}

type AnimalQueries {
    birds: BirdQueries
    getAnimals(names: [String!]!): [Animal]

}

type BirdQueries {
    parrot: String
    chicken: String
    birdsWithFeathers: [Animal]
}

type Animal {
    name: String
    species: String
}

type Mutation {
    updateBird(id: String): Animal
}
```
In javascript:

```js
import {GqlToTemplate} from 'graph-schema-to-query-templates'

new GqlToTemplate({
  // Link to your source .gql or .graphql file
  inputPath: "output/test.graphql",
  // Link to folder where files will be saved
  outputPath: "output",
  // Name of your service, this is arbitrary but should not contain hyphens
  serviceName: "BIRD_SERVICE",
  // defaults to ["query", "queries", "mutation", "mutations"]
  //   searchTokens: []
})
  .buildCollection()
  .exportCollection({
    // js or ts
    extension: "ts",
    // logs templates
    debug: true
  })
```

Produces the following files in the output folder
```
BIRD_SERVICE__bar.ts
BIRD_SERVICE__birdsWithFeathers.ts
BIRD_SERVICE__chicken.ts
BIRD_SERVICE__foo.ts
BIRD_SERVICE__getAnimals.ts
BIRD_SERVICE__parrot.ts
BIRD_SERVICE__updateBird.ts
```

with the following contents
```

export const template = `query BIRD_SERVICE____foo {foo }`
export const template = `query BIRD_SERVICE____bar {bar }`
export const template = `query BIRD_SERVICE__animals__birds__parrot {animals { birds { parrot  } }}`
export const template = `query BIRD_SERVICE__animals__birds__chicken {animals { birds { chicken  } }}`
export const template = `query BIRD_SERVICE__animals__birds__birdsWithFeathers {animals { birds { birdsWithFeathers {name  species } } }}`
export const template = `query BIRD_SERVICE__animals__getAnimals($names: [String!]!) {animals { getAnimals(names: $names) {name  species } }}`
export const template = `mutation BIRD_SERVICE____updateBird($id: String) {updateBird(id: $id) {name  species }}`
```