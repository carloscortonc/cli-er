import { closest } from "../src/edit-distance";

describe("closest", () => {
  it("Same string", () => {
    expect(closest("abc", ["abc"]).distance).toBe(0);
  });
  it("One char difference", () => {
    expect(closest("abc", ["ab"]).distance).toBe(1);
    expect(closest("abc", ["abb"]).distance).toBe(1);
    expect(closest("abc", ["abcd"]).distance).toBe(1);
  });
  it("Find the closest from the list", () => {
    expect(closest("-debuf", ["--des", "--debug", "--default"])).toStrictEqual({ value: "--debug", distance: 2 });
  });
});
