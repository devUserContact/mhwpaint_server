const mariadb = require('mariadb')
require('dotenv').config()

exports.connectToServer = async function () {
  let conn, query
  try {
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PSSWRD,
      socketPath: process.env.DB_SOCK,
    })

    console.log('connected ! connection id is ' + conn.threadId)
    await conn.query('USE mhwpaint;')
    query = await conn.query('SELECT * FROM works;')
  } catch (err) {
    console.debug('not connected due to error: ' + err)
  } finally {
    conn.close()
    return query
  }
}

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
