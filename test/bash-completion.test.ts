import { generateCompletions } from "../src/bash-completion";
import * as utils from "../src/utils";
import d from "./data/definition.json";
import Cli from "../src";

describe("generateCompletions", () => {
  beforeAll(() => {
    const mockDate = new Date(2022, 7, 4);
    jest.spyOn(global, "Date").mockImplementation((() => mockDate) as any);
    jest.spyOn(utils, "getClierVersion").mockImplementation(() => "clier-version");
  });
  const cliOptions: any = {
    cliName: "cliName",
    cliVersion: "cliVersion",
    completion: { command: "complete" },
  };
  const definition = new Cli(d as any).definition;
  it("bash-script gets printed via process.stdout.write", () => {
    const writeSpy = jest.spyOn(process.stdout, "write").mockImplementationOnce((() => {}) as any);
    generateCompletions({ definition, cliOptions });
    expect(writeSpy.mock.lastCall[0]).toMatchSnapshot();
    writeSpy.mockRestore();
  });
});
