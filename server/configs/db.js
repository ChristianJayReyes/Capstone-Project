// configs/db.js
import mysql from "mysql2/promise";

let pool;

const connectDB = async () => {
  if (!pool) {
    pool = mysql.createPool({
      host: "mysql-rosarioresortshotel.alwaysdata.net",   // e.g. localhost
      user: "423538",   // e.g. root
      password: "rosarioresorts",
      database: "rosarioresortshotel_db",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000,
    });
    console.log("✅ MySQL connected");
  }
  return pool;
};

export default connectDB;
