"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
console.log("DATABASE_URL:", process.env.DATABASE_URL);
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
