const mariadb = require("mariadb");
require("dotenv").config();

exports.connectToServer = async function () {
  try {
    const conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PSSWRD,
      socketPath: process.env.DB_SOCK,
    });

    console.log("connected ! connection id is " + conn.threadId);
    await conn.query("USE mhwpaint;");
    const query = await conn.query("SELECT * FROM works;");
    return query;
  } catch (err) {
    console.debug("not connected due to error: " + err);
  }
};

//exports.connectToDb = async function () {
//  console.log("test");
//  let conn;
//  try {
//    conn = await pool.getConnection();
//    const res = await conn.query("SHOW DATABASES;");
//    console.log(res);
//  } catch (error) {
//    console.error(error);
//  } finally {
//    conn.end();
//  }
//};
