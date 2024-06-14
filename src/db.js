const mariadb = require('mariadb')
require('dotenv').config()

exports.query_gallery = async function () {
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

exports.query_work = async function (id) {
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
exports.query_cart = async function (items) {
  let conn, query
  let cart_items = "'" + items.split('-').join("', '") + "'"
  console.log(cart_items)
  try {
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PSSWRD,
      socketPath: process.env.DB_SOCK,
    })

    console.log('connected ! connection id is ' + conn.threadId)
    await conn.query('USE mhwpaint;')
    query = await conn.query(
      `SELECT * FROM works WHERE unique_id IN (${cart_items}) ;`,
    )
  } catch (err) {
    console.debug('not connected due to error: ' + err)
  } finally {
    conn.close()
    return query
  }
}

exports.calcCartValue = async function (cartId) {
  let conn, query, total
  let prices = []
  const initialValue = 0

  let cart_items = "'" + cartId.split('-').join("', '") + "'"
  try {
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PSSWRD,
      socketPath: process.env.DB_SOCK,
    })

    console.log('connected ! connection id is ' + conn.threadId)
    await conn.query('USE mhwpaint;')
    query = await conn.query(
      `SELECT price FROM works WHERE unique_id IN (${cart_items}) ;`,
    )
    query.forEach((object) => prices.push(object.price))
    total = prices.reduce((a, b) => a + b, initialValue)
    total = total + 10
  } catch (err) {
    console.debug('not connected due to error: ' + err)
  } finally {
    conn.close()
    return total
  }
}

exports.setItemsToSold = async function (cartId) {
  let conn, query

  let cart_items = "'" + cartId.split('-').join("', '") + "'"
  try {
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PSSWRD,
      socketPath: process.env.DB_SOCK,
    })

    console.log('connected ! connection id is ' + conn.threadId)
    await conn.query('USE mhwpaint;')
    query = await conn.query(
      `UPDATE works SET sold = 1 WHERE unique_id IN (${cart_items});`,
    )
  } catch (err) {
    console.debug('not connected due to error: ' + err)
  } finally {
    conn.close()
    return
  }
}

exports.inputOrderTicket = async function (cartId) {
  let conn, query
  titles = []

  let cart_items = "'" + cartId.split('-').join("', '") + "'"
  try {
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PSSWRD,
      socketPath: process.env.DB_SOCK,
    })

    console.log('connected ! connection id is ' + conn.threadId)
    await conn.query('USE mhwpaint;')
    query = await conn.query(
      `SELECT title FROM works WHERE unique_id IN (${cart_items});`,
    )
    query.forEach((object) => titles.push(object.title))
    let titlesString = `'${titles.join(', ')}'` 
    console.log(titlesString)
    await conn.query(`INSERT INTO orders (titles) VALUES (${titlesString})`)
  } catch (err) {
    console.debug('not connected due to error: ' + err)
  } finally {
    conn.close()
    return
  }
}

exports.query_posts = async function () {
  let conn, query
  try {
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PSSWRD,
      socketPath: process.env.DB_SOCK,
    })

    console.log('connected ! connection id is ' + conn.threadId)
    await conn.query('USE devusercontact_blog;')
    query = await conn.query('SELECT * FROM posts;')
  } catch (err) {
    console.debug('not connected due to error: ' + err)
  } finally {
    conn.close()
    return query
  }
}

