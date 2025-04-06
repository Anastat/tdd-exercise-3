import { describe, test } from "vitest";
import { expect } from "chai";
import { daysUntilChristmasCopy } from "../src/untestable1.mjs";

describe("Untestable 1: days until Christmas", () => {
  test("275 days until Christmas from 25.3.2025", () => {
    const dateToTest = new Date("2025-03-25T03:24:00");
    expect(daysUntilChristmasCopy(dateToTest)).to.be.equal(275);
  });
});
