require('dotenv').config()
const createServer = require('./infrastructures/http/create-server')
const container = require('./infrastructures/container')

const start = async () => {
  const server = await createServer(container)
  await server.start()
  console.log(`server start at ${server.info.uri}...`)
}

start()
