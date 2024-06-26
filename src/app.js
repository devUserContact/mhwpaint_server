var express = require('express')
var cors = require('cors')

var fetch = require('node-fetch')
var path = require('path')
require('dotenv').config()

var db = require('./db.js')
const { warn } = require('console')

const app = express()

app.use(express.json())

var corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
}

app.get('/api', cors(corsOptions), (req, res) => res.send('test'))

app.get('/api/gallery', cors(corsOptions), async function (req, res) {
  let gallery = await db.query_gallery()
  res.send(gallery)
})

app.get('/api/gallery/:id', cors(corsOptions), async function (req, res) {
  let work = await db.query_work(req.params.id)
  res.send(work)
})

app.get('/api/cart/:cart_items', cors(corsOptions), async function (req, res) {
  let cart_items = await db.query_cart(req.params.cart_items)
  res.send(cart_items)
})

app.post(
  '/api/set-items-to-sold',
  cors(corsOptions),
  async function (req, res) {
    const { cart } = req.body
    await db.setItemsToSold(cart[0].id)
    res.send(200)
  },
)

app.post(
  '/api/input-order-ticket',
  cors(corsOptions),
  async function (req, res) {
    const { sale } = req.body
    console.log(sale.id)
    await db.inputOrderTicket(sale.id)
    res.send(200)
  },
)
// paypal
app.post('/api/orders', cors(corsOptions), async function (req, res) {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body
    cart[0].total = await db.calcCartValue(cart[0].id)
    const { jsonResponse, httpStatusCode } = await createOrder(cart)
    res.status(httpStatusCode).json(jsonResponse)
  } catch (error) {
    console.error('Failed to create order:', error)
    res.status(500).json({ error: 'Failed to create order.' })
  }
})

app.post(
  '/api/orders/:orderID/capture',
  cors(corsOptions),
  async function (req, res) {
    try {
      const { orderID } = req.params
      const { jsonResponse, httpStatusCode } = await captureOrder(orderID)
      res.status(httpStatusCode).json(jsonResponse)
    } catch (error) {
      console.error('Failed to create order:', error)
      res.status(500).json({ error: 'Failed to capture order.' })
    }
  },
)

const base = process.env.PAYPAL_BASE_URL
/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async function () {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      throw new Error('MISSING_API_CREDENTIALS')
    }
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET,
    ).toString('base64')
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Failed to generate Access Token:', error)
  }
}

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async function (cart) {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log(
    'shopping cart information passed from the frontend createOrder() callback:',
    cart,
  )

  const accessToken = await generateAccessToken()
  const url = `${base}/v2/checkout/orders`
  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: cart[0].total,
        },
      },
    ],
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return handleResponse(response)
}

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async function (orderID) {
  const accessToken = await generateAccessToken()
  const url = `${base}/v2/checkout/orders/${orderID}/capture`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  })

  return handleResponse(response)
}

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json()
    return {
      jsonResponse,
      httpStatusCode: response.status,
    }
  } catch (err) {
    const errorMessage = await response.text()
    throw new Error(errorMessage)
  }
}

// devUserContact

app.get('/api/blog/devusercontact/posts', cors(corsOptions), async function (req, res) {
  let gallery = await db.query_posts()
  res.send(gallery)
})

app.listen(3000, () => console.log('Server ready'))
