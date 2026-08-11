import Database from "better-sqlite3";

const db = new Database("./healthcoversim.db");

db.pragma("foreign_keys = ON");

export default db;