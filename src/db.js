export default function db() {
  const mariadb = require("mariadb");
  const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSSWRD,
  });

  async function asyncFunction() {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query("SHOW DATABASES;");
      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      conn.end();
    }
  }
}
