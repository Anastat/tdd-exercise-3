import { describe, test } from "vitest";
import { expect } from "chai";
import { parseFileToArray, parsePeopleCsvCopy } from "../src/untestable3.mjs";
import fs from "fs/promises";
import path from "path";

// example input:
// Loid,Forger,,Male
// Anya,Forger,6,Female
// Yor,Forger,27,Female

async function createTempFile() {
  const testData = "Loid,Forger,,Male\nAnya,Forger,6,Female\nYor,Forger,27,Female";
  const tempFilePath = path.join(__dirname, "temp-test-data.csv");
  await fs.writeFile(tempFilePath, testData, "utf8");

  return tempFilePath;
}

async function deleteTempFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.warn(`Failed to delete temp file: ${filePath}`, error);
  }
}

describe("Untestable 3: CSV file parsing", () => {
  test("can read file and parse to array", async () => {
    const tempFilePath = await createTempFile();

    const records = await parseFileToArray(tempFilePath);

    await deleteTempFile(tempFilePath);

    expect(records).toEqual([
      ["Loid", "Forger", "", "Male"],
      ["Anya", "Forger", "6", "Female"],
      ["Yor", "Forger", "27", "Female"],
    ]);
  });

  test("can read a file and convert it into an array of Objects", async () => {
    const tempFilePath = await createTempFile();

    const people = await parsePeopleCsvCopy(tempFilePath);

    await deleteTempFile(tempFilePath);

    expect(people).toEqual([
      { firstName: "Loid", lastName: "Forger", gender: "m" },
      { firstName: "Anya", lastName: "Forger", gender: "f", age: 6 },
      { firstName: "Yor", lastName: "Forger", gender: "f", age: 27 },
    ]);
  });
});
