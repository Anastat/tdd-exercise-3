import { afterEach, beforeEach, describe, test, expect } from "vitest";
import { PasswordServiceCopy, PostgresUserDaoCopy } from "../src/untestable4.mjs";
import * as argon2 from "@node-rs/argon2";
import dotenv from "dotenv";
import path from "path";
import pg from "pg";

dotenv.config({ path: path.resolve(__dirname, ".env.test") });

describe("Untestable 4: enterprise application", () => {
  let pool;
  let userDao;
  let service;

  beforeEach(() => {
    pool = new pg.Pool();
    userDao = new PostgresUserDaoCopy(pool);
    service = new PasswordServiceCopy(userDao, argon2);
  });

  afterEach(async () => {
    if (userDao) {
      await userDao.clearUsers();
      await userDao.close();
    }
  });

  test("successfully changes password in the database", async () => {
    await userDao.save({
      userId: 123,
      passwordHash: argon2.hashSync("oldPassword"),
    });

    await service.changePassword(123, "oldPassword", "newPassword");

    const updatedUser = await userDao.getById(123);
    const isValid = argon2.verifySync(updatedUser.passwordHash, "newPassword");

    expect(isValid).toBe(true);
  });

  test("throws error for wrong old password", async () => {
    await userDao.save({
      userId: 145,
      passwordHash: argon2.hashSync("correctPassword"),
    });

    await expect(service.changePassword(145, "wrongPassword", "newPassword")).rejects.toThrow("wrong old password");
  });
});
