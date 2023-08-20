import Cli from "../src";
import { formatMessage } from "../src/cli-messages";

let originalMessages: any;
beforeAll(() => {
  originalMessages = Cli.messages;
});

afterEach(() => {
  Cli.messages = originalMessages;
});

describe("format", () => {
  it("Format a message containing interpolations", () => {
    Cli.messages = { test: "This is a {name}" } as any;
    expect(formatMessage("test" as any, {})).toBe("This is a {name}");
    expect(formatMessage("test" as any, { name: "test" })).toBe("This is a test");
  });
});
