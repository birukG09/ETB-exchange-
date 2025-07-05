import sqlite3 from "sqlite3";
import { promises as fs } from "fs";
import path from "path";

export class Database {
  private db: sqlite3.Database;
  private static instance: Database;

  private constructor() {
    // Create database directory if it doesn't exist
    const dbDir = path.join(process.cwd(), "server", "database");

    // Initialize SQLite database
    this.db = new sqlite3.Database(
      path.join(dbDir, "etb_exchange.db"),
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error("Error opening database:", err);
        } else {
          console.log("✅ Connected to SQLite database");
          this.initializeSchema();
        }
      },
    );

    // Enable foreign key constraints
    this.db.run("PRAGMA foreign_keys = ON");
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async initializeSchema(): Promise<void> {
    try {
      const schemaPath = path.join(
        process.cwd(),
        "server",
        "database",
        "schema.sql",
      );
      const schema = await fs.readFile(schemaPath, "utf-8");

      // Execute schema in parts to handle multiple statements
      const statements = schema
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      for (const statement of statements) {
        await this.run(statement);
      }

      console.log("✅ Database schema initialized");
    } catch (error) {
      console.error("❌ Error initializing database schema:", error);
    }
  }

  // Promisify database methods
  public run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  public get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  public all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Transaction helper
  public async transaction<T>(callback: () => Promise<T>): Promise<T> {
    await this.run("BEGIN TRANSACTION");
    try {
      const result = await callback();
      await this.run("COMMIT");
      return result;
    } catch (error) {
      await this.run("ROLLBACK");
      throw error;
    }
  }
}

// Export singleton instance
export const db = Database.getInstance();
