import CliLogger from "../src/cli-logger";

describe("CliLogger", () => {
  it("log", () => {
    const writeMock = jest.spyOn(process.stdout, "write");
    CliLogger.log("a", "b");
    expect(writeMock).toHaveBeenCalledWith("ab");
  });
  it("error", () => {
    const errorMock = jest.spyOn(process.stderr, "write");
    CliLogger.error("a", "b");
    expect(errorMock).toHaveBeenCalledWith("ERROR ab");
  });
});
