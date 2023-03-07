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
describe("functionality suite", ()=>{

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