import argon2 from "@node-rs/argon2";
import pg from "pg";

/**
 * Not allow to inject configurable DB pool.
 * No function to delete user for cleaning test DB.
 */
export class PostgresUserDao {
  static instance;

  static getInstance() {
    if (!this.instance) {
      this.instance = new PostgresUserDao();
    }
    return this.instance;
  }

  db = new pg.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });

  close() {
    this.db.end();
  }

  #rowToUser(row) {
    return { userId: row.user_id, passwordHash: row.password_hash };
  }

  async getById(userId) {
    const { rows } = await this.db.query(
      `select user_id, password_hash
       from users
       where user_id = $1`,
      [userId]
    );
    return rows.map(this.#rowToUser)[0] || null;
  }

  async save(user) {
    await this.db.query(
      `insert into users (user_id, password_hash)
       values ($1, $2)
       on conflict (user_id) do update
           set password_hash = excluded.password_hash`,
      [user.userId, user.passwordHash]
    );
  }
}
/**
 * No possibility to define a test database or DAO implementation.
 * Hasher library in use defined inside function.
 */
export class PasswordService {
  users = PostgresUserDao.getInstance();

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.users.getById(userId);
    if (!argon2.verifySync(user.passwordHash, oldPassword)) {
      throw new Error("wrong old password");
    }
    user.passwordHash = argon2.hashSync(newPassword);
    await this.users.save(user);
  }
}

export class PostgresUserDaoCopy {
  static instance;

  static getInstance(pool) {
    if (!this.instance) {
      this.instance = new PostgresUserDaoCopy(pool);
    }
    return this.instance;
  }

  constructor(pool = null) {
    this.db = pool || new pg.Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
      });
  }

  close() {
    return this.db.end();
  }

  #rowToUser(row) {
    return { userId: row.user_id, passwordHash: row.password_hash };
  }

  async getById(userId) {
    const { rows } = await this.db.query(
      `select user_id, password_hash
       from users
       where user_id = $1`,
      [userId]
    );
    return rows.map(this.#rowToUser)[0] || null;
  }

  async save(user) {
    await this.db.query(
      `INSERT INTO users (user_id, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE
       SET password_hash = EXCLUDED.password_hash`,
      [user.userId, user.passwordHash]
    );
  }

  async clearUsers() {
    await this.db.query(`DELETE FROM users`);
  }
}

export class PasswordServiceCopy {
  constructor(userDao, hasher = argon2) {
    this.users = userDao;
    this.hasher = hasher;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.users.getById(userId);
    if (!this.hasher.verifySync(user.passwordHash, oldPassword)) {
      throw new Error("wrong old password");
    }
    user.passwordHash = this.hasher.hashSync(newPassword);
    await this.users.save(user);
  }
}
