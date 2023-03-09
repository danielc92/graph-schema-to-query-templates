import { GqlToTemplate } from "../index"

describe("config suite", ()=>{
  it("should have a default searchToken list if not provided", ()=>{
    expect.assertions(1);
    const gql = new GqlToTemplate({
      inputPath: "./src/graph-samples/sample.graphql",
      outputPath: './output',
      serviceName: "MyTestService"
    })
    expect(gql.config.searchTokens).toEqual(["query", "queries", "mutation", "mutations"])

  })

  it("should have provided options", ()=>{
    expect.assertions(1);
    const gql = new GqlToTemplate({
      inputPath: "./src/graph-samples/sample.graphql",
      outputPath: './output',
      searchTokens: ["custom", "search", "tokens"],
      serviceName: "MyTestService"
    })
    expect(gql.config).toEqual(
      expect.objectContaining({
        inputPath: "./src/graph-samples/sample.graphql",
        outputPath: './output',
        searchTokens: ["custom", "search", "tokens"],
        serviceName: "MyTestService"

      })
    )

  })
})
describe("template suite", () => {
  it("query snapshot WITH args", () => {
    expect.assertions(1);
    const result = new GqlToTemplate({
      inputPath: "./src/graph-samples/with-args.graphql",
      outputPath: './output',
      serviceName: "ArgsTest"
    }).buildCollection()
      .exportCollection({debug: true})

    expect(result).toMatchSnapshot()
  })

  it("query snapshot WITHOUT args", () => {
    expect.assertions(1);
    const result = new GqlToTemplate({
      inputPath: "./src/graph-samples/no-args.graphql",
      outputPath: './output',
      serviceName: "NoArgsTest"
    }).buildCollection()
      .exportCollection({debug: true})

    expect(result).toMatchSnapshot()
  })
})
describe("functionality suite", ()=>{

  it("generates templates when searchTokens is provided", () => {
    expect.assertions(1);
    const result = new GqlToTemplate({
      inputPath: "./src/graph-samples/nested-query-custom-name.graphql",
      outputPath: './output',
      serviceName: "CustomSearchToken",
      searchTokens: ["capybara"]
    }).buildCollection()
      .exportCollection({debug: true})

    expect(result).toMatchSnapshot()
  })

  it("basic mutation snapshot", () => {
    expect.assertions(1);
    const result = new GqlToTemplate({
      inputPath: "./src/graph-samples/basic-mutation.graphql",
      outputPath: './output',
      serviceName: "BasicMutation"
    }).buildCollection()
      .exportCollection({debug: true})

    expect(result).toMatchSnapshot()
  })
  it("generating nested queries 3 levels deep", () => {
    expect.assertions(1);
    const result = new GqlToTemplate({
      inputPath: "./src/graph-samples/nested-query.graphql",
      outputPath: './output',
      serviceName: "Nested"
    }).buildCollection()
      .exportCollection({debug: true})

    expect(result).toMatchSnapshot()
  })
  it("result contains service name + snapshot matches", () => {
    expect.assertions(2);
    const result = new GqlToTemplate({
      inputPath: "./src/graph-samples/sample.graphql",
      outputPath: './output',
      serviceName: "MyTestService"
    }).buildCollection()
      .exportCollection({debug: true})

    expect(result).toContain("MyTestService")
    expect(result).toMatchSnapshot()
  })

  it("when debug is true console.log should be called", () => {
    expect.assertions(1);
    const spyer = jest.spyOn(global.console, "log")
    new GqlToTemplate({
      inputPath: "./src/graph-samples/sample.graphql",
      outputPath: './output',
      serviceName: "MyTestService"
    }).buildCollection()
      .exportCollection({debug: true})

    expect(spyer).toHaveBeenCalled()
  })
})