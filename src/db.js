const mariadb = require('mariadb')
require('dotenv').config()

exports.queryGallery = async function () {
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

exports.queryWork = async function (id) {
  let conn, query
  try {
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PSSWRD,
      socketPath: process.env.DB_SOCK,
    })

    console.log('connected ! connection id is ' + conn.threadId)
    let unique_id = id
    console.log(unique_id)
    await conn.query('USE mhwpaint;')
    query = await conn.query(
      `SELECT * FROM works WHERE unique_id = "${unique_id}";`,
    )
  } catch (err) {
    console.debug('not connected due to error: ' + err)
  } finally {
    conn.close()
    return query
  }
}
