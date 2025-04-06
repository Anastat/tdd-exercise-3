import { describe, test } from "vitest";
import { expect } from "chai";
import { diceHandValueCopy } from "../src/untestable2.mjs";

describe("Untestable 2: a dice game", () => {
  test("the result is 101 when dice 1 and dice 2 are same ", () => {
    const minRange = 1;
    const maxRange = 1;
    expect(diceHandValueCopy(minRange, maxRange)).to.be.equal(101);
  });
});

describe("Untestable 2: a dice game", () => {
  test("the result ranges from 1 to 4 and from 101 to 104 if the dice are the same", () => {
    const minRange = 1;
    const maxRange = 4;
    expect(diceHandValueCopy(minRange, maxRange)).to.be.oneOf([1, 2, 3, 4, 101, 102, 103, 104]);
  });
});
