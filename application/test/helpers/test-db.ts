import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

import { ConnectionString } from "connection-string";
import { Client, Pool } from "pg";

const runSql = async (
  query: string,
  databaseUrl = process.env.DATABASE_URL,
): Promise<void> => {
  if (!databaseUrl) {
    throw new Error("Unable to perform query without DATABASE_URL.");
  }

  const client = new Client(databaseUrl);
  await client.connect();
  await client.query(query);
  await client.end();
};

const createDatabase = (database: string): Promise<void> => {
  return runSql(`CREATE DATABASE ${database};`);
};

const dropDatabase = (database: string): Promise<void> => {
  return runSql(`DROP DATABASE IF EXISTS ${database};`);
};

const createTablesScriptPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "ingestion",
  "scripts",
  "create-tables.sql",
);
const createTablesScript = fs.readFileSync(createTablesScriptPath, "utf-8");

const createTables = async (databaseUrl: string): Promise<void> => {
  await runSql(createTablesScript, databaseUrl);
};

export class TestDb {
  private readonly name = `test_${randomUUID().toString().replaceAll("-", "")}`;
  public pool!: Pool;

  public get url(): string {
    const connectionString = new ConnectionString(process.env.DATABASE_URL);
    connectionString.path = [this.name];

    return connectionString.toString();
  }

  public async up(): Promise<void> {
    await createDatabase(this.name);
    await createTables(this.url);

    this.pool = new Pool({
      connectionString: this.url,
      min: 1,
      max: 1,
    });
  }

  public async down(): Promise<void> {
    await this.pool.end();
    await dropDatabase(this.name);
  }

  public async run(callback: (pool: Pool) => Promise<void>): Promise<void> {
    try {
      await this.up();
      await callback(this.pool);
    } finally {
      await this.down();
    }
  }
}
